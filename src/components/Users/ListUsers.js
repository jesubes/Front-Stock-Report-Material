
import React, { useState } from 'react'
import { reportByNumber } from '../../api/report.api';
import { Button, Checkbox, Icon, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from 'semantic-ui-react';

export const ListUsers = (props) => {

    const { jsonData, jsonDataContact } = props;

    //pasar el valor del check a true en todos los documentos del jsonDataContact
    const addCheckContact = jsonDataContact.map(item => ({
        ...item, //mantiene los campos
        checkToSend: true,
        isSend: false // para cada contacto el tielde verde de enviado no se mostrara 
    }))

    const [dataSelect, setDataSelect] = useState(addCheckContact)



    //manejar los check 
    const handleCheckboxChange = (index) => {
        setDataSelect(prevData => prevData.map((item, indexOfData) =>
            indexOfData === index
                ? { ...item, checkToSend: !item.checkToSend }
                : item
        ))
    }


    //Boton de enviar 
    const handleButtonCharge = async () => {
        //recorremos los contactos y manejamos las pormesas con Promise.all
        // eslint-disable-next-line
        const results = await Promise.all(dataSelect.map(async (contact, index) => {  

            if (contact.checkToSend) {
                //filtramos los materiales por el almacen de contactos
                const resultByAlmacen = jsonData.filter(material => (contact.Almacén === material.Almacén) && contact.checkToSend)

                //llamamos a la API reportByNumber y obtenemos la respuesta
                const res = await reportByNumber(contact.Numero, contact.Nombre, resultByAlmacen)

                //actualizamos el estado de isSend para el contacto actual  
                setDataSelect(prevData => prevData.map((item, indexOfData) =>
                    indexOfData === index ? { ...item, isSend: res.messageSent } : item
                ))

                console.log(res);
                
                return res
            }

        }))
    }


    //
    return (
        <div style={{ margin: '20px' }}>
            <Table compact striped>
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell />
                        <TableHeaderCell>Almacén</TableHeaderCell>
                        <TableHeaderCell>Nombre</TableHeaderCell>
                        <TableHeaderCell>Numero</TableHeaderCell>
                        <TableHeaderCell>Enviado</TableHeaderCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {dataSelect.map((contact, index) => (
                        (contact.Numero && contact.Nombre) && (
                            <TableRow key={index}>
                                <TableCell>
                                    <Checkbox
                                        checked={contact.checkToSend} //establecer el estado si esta marcado
                                        onChange={() => handleCheckboxChange(index)}  //manejar los cambios
                                    />
                                </TableCell>
                                <TableCell>{contact.Almacén}</TableCell>
                                <TableCell>{contact.Nombre}</TableCell>
                                <TableCell>{contact.Numero}</TableCell>
                                <TableCell>
                                    {contact.isSend && (
                                        <Icon color='green' name='checkmark' size='large' />
                                    )}
                                </TableCell>
                            </TableRow>
                        )
                    ))}
                </TableBody>
            </Table>

            {(jsonData !== undefined && jsonDataContact !== undefined) && (
                <Button primary
                    onClick={handleButtonCharge}
                >
                    Enviar Reporte
                </Button>
            )}
        </div>
    )
}
