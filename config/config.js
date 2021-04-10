/**
 * CONFIGURACION GENERAL DEL SERVIDOR
 */
 //======================
 //||       PORT       ||
 //======================
 process.env.PORT = process.env.PORT || 3000;

 //======================
 //||   ENVIROMENT     ||
 //======================
 process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

 //======================
 //||  DB CONNECTION   ||
 //======================
 let url_connection;

 if(process.env.NODE_ENV === 'dev')
    url_connection = 'mongodb://localhost:27017/cafe'
 else
    url_connection = 'mongodb+srv://Roberto117:$greenarrow031100@programas.z1xrs.mongodb.net/cafe?retryWrites=true&w=majority';

 process.env.URL_CONNECTION = url_connection;

 //=============================
 //||  SEED DE AUTENTICACION  ||
 //=============================

 process.env.SEED_AUTH = "JBkvvVHB647bjhbudfXG6769"

 //=============================
 //||  VENCIMIENTO DEL TOKEN  ||
 //=============================
 /**
  * 60 s * 60 min * 24 horas * 30 = 30 dias
  */
 process.env.EXP_TOKEN = "30d";//30 DIAS