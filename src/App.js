
import React, { useEffect, useState } from 'react'
import { uploadFileContact, uploadFileExcel } from './api/excel.api'
import { ListUsers } from './components/Users';
import { Card, Button, Input, CardContent, CardHeader, CardDescription } from 'semantic-ui-react'
import './App.css';
import { Toaster, toast } from 'sonner'

//constant
import {ENV} from './utils/constants.js'

//Diferentes estados de la app
const APP_STATUS = {
  IDLE: 'idle',   //al entrar
  ERROR: 'error', // cuando hay un error
  READY_UPLOAD: 'ready_upload', //al elegir el archivo
  UPLOADING: 'uploading', // mientras se sube el archivo
  READY_USAGE: 'ready_usage', //despues de subir
}

//Diccionario de estado de boton
const BUTTON_TEXT = {
  [APP_STATUS.READY_UPLOAD]: 'Subir archivo',
  [APP_STATUS.UPLOADING]: 'Subiendo ...'
};


//
function App() {
  const [appStatus, setAppStatus] = useState(APP_STATUS.IDLE)
  const [data, setData] = useState([])
  const [file, setFile] = useState(null)
  const [fileContact, setFileContact] = useState(null)
  const [dataContact, setDataContact] = useState([])
  const [qrHtml, setQrHtml] = useState('');


  useEffect(() => {
    const fetchQrCode = async () => {
      try {
        const response = await fetch(`${ENV.BASE_API}/${ENV.API_ROUTES.QR_GENERATE}`)
        // const response = await fetch('http://localhost:4000/api/qrcode')
        const data = await response.text(); //Obtener el HTML en formtato de texto
        setQrHtml(data)
      } catch (error) {
        console.error('Error QR', error);
      }
    }

    fetchQrCode();
  }, [])

  //accion de formulario
  const handleSubmit = async (event) => {
    event.preventDefault();

    //condicion para retorno vacio
    if (appStatus !== APP_STATUS.READY_UPLOAD || !file) {
      return
    }

    setAppStatus(APP_STATUS.UPLOADING)

    const [err, newData] = await uploadFileExcel(file) //'TODO CARGAR EL ARCHIVO LA MEMOERIA DE LA API'


    //mostrar el error
    if (err) {
      setAppStatus(APP_STATUS.ERROR)
      toast.error(err.message) //
      return
    }

    //mostrar el archivo subido correto
    // setAppStatus(APP_STATUS.READY_USAGE)
    if (newData) setData(newData)
    toast.success('Archivo MATERIALES subido correctamente')
  }

  //accion del boton de carga de contactos
  const handleSubmitContact = async (event) => {
    event.preventDefault();

    //condicion para retornar vacio
    // if(appStatus !== APP_STATUS.READY || !fileContact){
    //   return
    // }


    const [err, newData] = await uploadFileContact(fileContact)  //TODO llamar a la api asi proceso los CONTACTOS


    //mostar el error
    if (err) {
      toast.error(err.message)
      return
    }

    if (newData) setDataContact(newData)
    toast.success('Archivo CONTACTO subido correctamente')
  }

  const handleInputChangeContact = async (event) => {
    const [file] = event.target.files ?? []

    if (file) {
      setFileContact(file);
    }
  }

  //accion de ingreso del archivo
  const handleInputChange = (event) => {
    const [file] = event.target.files ?? []

    if (file) {
      setFile(file);
      setAppStatus(APP_STATUS.READY_UPLOAD)
    }
  }

  const [showHtmlQr, setShowHtmlQr] = useState('false')
  //accion boton del mostrar QR
  const handleShowQR = () => {
    setShowHtmlQr((prevState) => !prevState)
  }

  //Mostart el button
  const showButton = appStatus === APP_STATUS.READY_UPLOAD || appStatus === APP_STATUS.UPLOADING;
  const showQR = true
  const showButtonContact = true
  

  //
  return (
    <div className="App">
      <Toaster />
      <Card centered fluid>
        <CardContent>
          <CardHeader>Cargar Archivo excel de reporte de Materiales</CardHeader>
          <CardDescription>
            <form onSubmit={handleSubmit}>
              <label >
                <Input
                  disabled={appStatus === APP_STATUS.UPLOADING}
                  name='file'
                  onChange={handleInputChange}
                  type='file'
                  accept='.xlsx'
                />
              </label>
              {showButton && (
                <Button secondary disabled={appStatus === APP_STATUS.UPLOADING}>
                  {BUTTON_TEXT[appStatus]}
                </Button>
              )}
            </form>
          </CardDescription>
        </CardContent>
      </Card>

      <Card centered fluid>
        {showQR && (
          <CardContent>
            <CardHeader>Carga del QR para Whatsapp</CardHeader>
            <Button primary
              disabled={false}
              onClick={handleShowQR}
            >
              Mostar QR
            </Button >

          </CardContent>
        )}


        {showHtmlQr && (
          <div dangerouslySetInnerHTML={{ __html: qrHtml }} />
        )}
      </Card>

      {/* Cargamos el archivo de CONTACTOS */}
      {(appStatus === APP_STATUS.IDLE || appStatus === APP_STATUS.UPLOADING || appStatus === APP_STATUS.READY_USAGE) && (
        <Card centered fluid>
          <CardContent>
            <CardHeader>Cargar los Contactos de un excel</CardHeader>
            <CardDescription >
              <form onSubmit={handleSubmitContact}>
                <label >
                  <Input
                    // disabled={appStatus === APP_STATUS.UPLOADING}
                    name='fileContact'
                    onChange={handleInputChangeContact}
                    type='file'
                    accept='.xlsx'
                  />
                </label>
                {showButtonContact && (
                  <Button secondary>
                    Subir Contactos
                  </Button>
                )}
              </form>

            </CardDescription>

          </CardContent>
        </Card>
      )}


      {(dataContact && dataContact.length > 0) ? (
        <ListUsers jsonData={data} jsonDataContact={dataContact} />
      ) : 
        null  
      }
    </div>
  );
}

export default App;
