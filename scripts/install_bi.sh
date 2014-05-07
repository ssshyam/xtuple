#!/bin/sh
RUN_DIR=$(pwd)
LOG_FILE=$RUN_DIR/install_bi.log
mv $LOG_FILE $LOG_FILE.old
log() {
	echo $@
	echo $@ >> $LOG_FILE
}

varlog() {
	log $(eval "echo $1 = \$$1")
}

cdir() {
	cd $1
	log "Changing directory to $1"
}

RUNALL=true
BI_DIR=$RUN_DIR/../../bi
PRIVATE_DIR=$RUN_DIR/../../private-extensions
XT_DIR=$RUN_DIR/..
export BISERVER_HOME=$RUN_DIR/../../ErpBI
DATABASE=dev
DATABASEHOST=localhost
DATABASEUSER=admin
DATABASEPASSWORD=admin
DATABASEPORT=5432
DATABASELOADPORT=5432
DATABASESSL=
TENANT=default
CITIES=democities.txt
COMMONNAME=$(hostname)
CREATE=Y
INCREMENTAL=N

while getopts ":ieblmuxyd:U:g:P:t:n:j:z:h:p:c:o:r:k:" opt; do
  case $opt in
    e)
      # Install ErpBI and configure
      RUNALL=
      DOWNLOAD=true
      ;;
    b)
      # Build BI solution and install
      RUNALL=
      RUN=true
      ;;
    l)
      # Extract and load analytic data into erpbi database
      RUNALL=
      LOAD=true
      ;;
    m)
      # Prep the Mobile Client to connect to BI Server
      RUNALL=
      PREP=true
      ;;
    d)
      # Set database name (for extract)
      DATABASE=$OPTARG
      ;;
    p)
      # Set database port for extract)
      DATABASEPORT=$OPTARG
      ;;
    h)
      # Set database host name (for extract)
      DATABASEHOST=$OPTARG
      ;;
    U)
      # Set database user name (for extract)
      DATABASEUSER=$OPTARG
      ;;
    P)
      # Set database user password (for extract)
      DATABASEPASSWORD=$OPTARG
      ;;
    o)
      # Set database port (for load)
      DATABASELOADPORT=$OPTARG
      ;;	  
    y)
      # Set database ssl connect option (for extract)
      DATABASESSL="?ssl=true\&sslfactory=org.postgresql.ssl.NonValidatingFactory"
      ;;
    k)
      # Server key file for SSL
      SSLKEY=$OPTARG
      ;;
    r)
      # Server certificate file for SSL
      SSLCERT=$OPTARG
      ;;	  
    t)
      # Set tenant name
      TENANT=$OPTARG
      ;;
    g)
      # Geographic data file
      CITIES=$OPTARG
      ;;	  
    n)
      # Common name for self signed SSL certificate
      COMMONNAME=$OPTARG
      ;;
    c)
      # Path for config file
      CONFIGPATH=$OPTARG
      ;;
    u)
      # Incremental updates
      INCREMENTAL=Y
      ;;
    j)
      # Java home
      export JAVA_HOME=$OPTARG
      ;;
    x)
      # Do not create erpbi database schema
      CREATE=N
      ;;
    z)
      # ErpBI.zip path
      export ERPBIPATH=$OPTARG
      ;;  
    \?)
      log "Invalid option: -"$OPTARG
      exit 1
      ;;
    :)
      log "Option -"$OPTARG" requires an argument."
      exit 1
      ;;
  esac
done

if [ $RUNALL ]
then
	DOWNLOAD=true
	RUN=true
	LOAD=true
	PREP=true
fi

if  [ "$INCREMENTAL" = "Y" ]
then
	CREATE=N
fi

if  ! test -d $BI_DIR ;
then
	log ""
	log "#############################################################"
    log "Sorry bi folder not found.  You must clone xtuple/bi"
	log "#############################################################"
	log ""
    exit 1
fi

if  [ $ERPBIPATH ]
then
	if   ! test -f $ERPBIPATH  
	then
		log ""
		log "####################################################################################"
		log "Sorry can't find ErpBI.zip at "$ERPBIPATH
		log "####################################################################################"
		log ""
		exit 1
	fi
fi

if  [ $CONFIGPATH ]
then
	if   ! test -f $CONFIGPATH  
	then
		log ""
		log "####################################################################################"
		log "Sorry can't find config file at "$CONFIGPATH
		log "####################################################################################"
		log ""
		exit 1
	fi
else
	CONFIGPATH=config.js
fi

if   ! test -d $PRIVATE_DIR && $RUNALL   
then
	log ""
	log "####################################################################################"
    log "Sorry private-extensions folder not found.  You must clone xtuple/private-extensions"
	log "####################################################################################"
	log ""
    exit 1
fi

if  [ $SSLKEY ]
then
	if  ! [ $SSLCERT ]
	then
		log ""
		log "####################################################################################"
		log "Sorry if SSL Key is specified, SSL certificate must be specified."
		log "####################################################################################"
		log ""
		exit 1
	fi
fi

if  [ $SSLCERT ]
then
	if  ! [ $SSLKEY ]
	then
		log ""
		log "####################################################################################"
		log "Sorry if SSL certificate is specified, the SSL key must be specified."
		log "####################################################################################"
		log ""
		exit 1
	fi
fi

install_packages () {
	log ""
	log "######################################################"
	log "Install prereqs."
	log "######################################################"
	log ""
	apt-get install -qy git openjdk-6-jdk maven2
	export JAVA_HOME=$(readlink -f /usr/bin/javac | sed "s:bin/javac::")	
	if  ! test -e $JAVA_HOME/bin/javac ;
	then
		log ""
		log "#############################################################"
		log "Sorry can not find javac.  Set Java Home with the -j argument"
		log "#############################################################"
		log ""
		exit 1
	fi
}

download_files () {
	log ""
	log "######################################################"
	log "Download ErpBI, set permissions and generate keystore "
	log "and truststore for SSL with self signed cert using    "
	log "common name "$COMMONNAME
	log "######################################################"
	log ""

	rm -R ../../ErpBI	
	if  [ $ERPBIPATH ]
	then
		log ""
		log "######################################################"
		log "Unzipping "$ERPBIPATH
		log "######################################################"
		log ""
		unzip -q $ERPBIPATH -d ../..
	else
		rm ../../ErpBI.zip
		wget http://sourceforge.net/projects/erpbi/files/candidate-release/ErpBI.zip/download -O ../../ErpBI.zip
		log ""
		log "######################################################"
		log "Unzipping ErpBI.zip"
		log "######################################################"
		log ""
		unzip -q ../../ErpBI.zip -d ../..
	fi		

	cdir $BISERVER_HOME/biserver-ce/
	chmod 755 -R . 2>&1 | tee -a $LOG_FILE
	
	if  [ $SSLKEY ]
	then
		cp $SSLKEY $BISERVER_HOME/biserver-ce/ssl-keys
		cp $SSLCERT $BISERVER_HOME/biserver-ce/ssl-keys
		cdir $BISERVER_HOME/biserver-ce/ssl-keys
		rm cacerts.jks
		rm keystore_server.jks
		rm server.cer
		openssl pkcs12 -export -out server.pkcs12 -in $SSLCERT -inkey $SSLKEY -passout pass:changeit
		keytool -importkeystore -srcstorepass changeit -deststorepass changeit -srckeystore server.pkcs12 -srcstoretype PKCS12 -destkeystore keystore_server.jks -deststoretype JKS 
		keytool -export -alias 1 -file $SSLCERT -storepass changeit -keystore keystore_server.jks
		keytool -import -alias 1 -v -trustcacerts -file $SSLCERT -keypass changeit -storepass changeit -keystore cacerts.jks -noprompt	
	else
		cdir $BISERVER_HOME/biserver-ce/ssl-keys
		rm cacerts.jks
		rm keystore_server.jks
		rm server.cer
		keytool -genkey -alias tomcat -keyalg RSA -keypass changeit -storepass changeit -keystore keystore_server.jks -dname "cn="$COMMONNAME", ou=xTuple, o=xTuple, c=US"
		keytool -export -alias tomcat -file server.cer -storepass changeit -keystore keystore_server.jks
		keytool -import -alias tomcat -v -trustcacerts -file server.cer -keypass changeit -storepass changeit -keystore cacerts.jks -noprompt	
	fi
	
	cdir $BISERVER_HOME/biserver-ce/tomcat/conf/Catalina/localhost
	mv pentaho.xml pentaho.xml.sample
	cat pentaho.xml.sample | \
	sed s/org.h2.Driver/org.postgresql.Driver/ | \
	sed s#jdbc:h2:../../../h2database/demomfg#jdbc:postgresql://localhost:5432/erpbi# \
	> pentaho.xml  2>&1 | tee -a $LOG_FILE
}

run_scripts() {
	log ""
	log "######################################################"
	log "Build BI solution and move to ErpBI at:               "
	log $BISERVER_HOME
	log "######################################################"
	log ""
	cdir $BI_DIR/olap-schema
	mvn install 2>&1 | tee -a $LOG_FILE
	java -jar Saxon-HE-9.4.jar -s:src/erpi-tenant-xtuple.xml -xsl:style.xsl -o:target/erpi-schema.xml
	mvn process-resources 2>&1 | tee -a $LOG_FILE

	cdir ../pentaho-extensions/oauthsso
	mvn clean 2>&1 | tee -a $LOG_FILE
	mvn install 2>&1 | tee -a $LOG_FILE
	mvn process-resources 2>&1 | tee -a $LOG_FILE

	cdir ../dynschema
	mvn install 2>&1 | tee -a $LOG_FILE
	mvn process-resources 2>&1 | tee -a $LOG_FILE
	
	cdir ../utils
	mvn install 2>&1 | tee -a $LOG_FILE
	mvn process-resources 2>&1 | tee -a $LOG_FILE

	cdir ../../etl
	mvn install 2>&1 | tee -a $LOG_FILE
	mvn process-resources 2>&1 | tee -a $LOG_FILE
}

load_pentaho() {
	log ""
	log "######################################################"
	log "Extract data from "$DATABASE" on host "$DATABASEHOST 
	log "and load data into erpbi with tenant name " $TENANT
	log "######################################################"
	log ""
	createdb -U postgres -O admin erpbi 2>&1 | tee -a $LOG_FILE
	cdir $BISERVER_HOME/data-integration
	export KETTLE_HOME=properties/psg-linux
	
	mv $KETTLE_HOME/.kettle/kettle.properties $KETTLE_HOME/.kettle/kettle.properties.sample  2>&1 | tee -a $LOG_FILE
	cat $KETTLE_HOME/.kettle/kettle.properties.sample | \
	sed s'#erpi.source.url=.*#erpi.source.url=jdbc\:postgresql\://'$DATABASEHOST'\:'$DATABASEPORT'/'$DATABASE$DATABASESSL'#' | \
	sed s'#erpi.source.user=.*#erpi.source.user='$DATABASEUSER'#' | \
	sed s'#erpi.source.password.*#erpi.source.password='$DATABASEPASSWORD'#' | \
	sed s'#erpi.datamart.port.*#erpi.datamart.port='$DATABASELOADPORT'#' | \
	sed s'#erpi.datamart.url=.*#erpi.datamart.url=jdbc\:postgresql\://localhost\:'$DATABASELOADPORT'/erpbi#' | \
	sed s'#erpi.cities.file.*#erpi.cities.file='$CITIES'#' | \
	sed s'#erpi.tenant.id=.*#erpi.tenant.id='$TENANT'.'$DATABASE'#' | \
	sed s'#erpi.datamart.create=.*#erpi.datamart.create='$CREATE'#' | \
	sed s'#erpi.incremental=.*#erpi.incremental='$INCREMENTAL'#' \
	> $KETTLE_HOME/.kettle/kettle.properties  2>&1 | tee -a $LOG_FILE
	
	sh kitchenkh.sh -file=../ErpBI/ETL/JOBS/Load.kjb -level=Basic
}

prep_mobile() {
	log ""
	log "######################################################"
	log "Prepare mobile app to use the BI Server. Create keys  "
    log "for REST api used by single sign on.  Update config.js"
    log "with BI Server URL https://"$COMMONNAME":8443"
	log "######################################################"
	log ""
	if [ ! -d $XT_DIR/node-datasource/lib/rest-keys ]
    then
      mkdir $XT_DIR/node-datasource/lib/rest-keys
    fi
	cdir $XT_DIR/node-datasource/lib/rest-keys
	openssl genrsa -out server.key 1024 2>&1 | tee -a $LOG_FILE
	openssl rsa -in server.key -pubout > server.pub 2>&1 | tee -a $LOG_FILE
	
	#
	# Would be better to get multiline sed working to put commonname in:
	# biserver: {
	#    hostname: myname
	#
	# Something similar to:
	#	sed 'N;s#biServer: {\n        hostname:.*#biServer: {\n        hostname: \"'$COMMONNAME'\",#' \
	
	cdir $XT_DIR/node-datasource
	mv $CONFIGPATH $CONFIGPATH'.old' 2>&1 | tee -a $LOG_FILE
	cat $CONFIGPATH'.old' | \
	sed 's#restkeyfile: .*#restkeyfile: \"./lib/rest-keys/server.key\",#' | \
	sed 's#tenantname: .*#tenantname: \"'$TENANT'",#' | \
	sed 's#bihost: .*#bihost: \"'$COMMONNAME'\",#' \
	> $CONFIGPATH
}

install_packages

if [ $? -ne 0 ]
then
	log "bad."
fi

if [ $DOWNLOAD ]
then
	download_files
fi

if [ $RUN ]
then
	run_scripts
fi

if [ $LOAD ]
then
	load_pentaho
fi

if [ $PREP ]
then
	prep_mobile
fi

log ""
log "######################################################"
log "                FINISED! READ ME                      "
log "If you use the self signed certificate created by this"
log "script you will need to accept the certificate in your"
log "browser.  Connect to https://"$COMMONNAME":8443"
log "######################################################"
log ""
