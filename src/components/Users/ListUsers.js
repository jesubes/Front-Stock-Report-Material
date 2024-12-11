
import React, { useState, useMemo } from 'react'
import { reportByNumber } from '../../api/report.api';
import {
    Button,
    Checkbox,
    Icon,
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableHeaderCell,
    TableRow,
    Dropdown
} from 'semantic-ui-react';

export const ListUsers = (props) => {

    const { jsonData, jsonDataContact } = props;
    //pasar el valor del check a true en todos los documentos del jsonDataContact

    // const addCheckContact = jsonDataContact.map(item => ({
    //     ...item, //mantiene los campos
    //     checkToSend: true,
    //     isSend: false // para cada contacto el tielde verde de enviado no se mostrara 
    // }))

    //Inicializar datos con campos adicionales
    const addCheckContact = useMemo(
        () => jsonDataContact.map(item => ({
            ...item,
            checkToSend: true,
            isSend: false,
        })),
        [jsonDataContact]
    )


    const [dataSelect, setDataSelect] = useState(addCheckContact)
    const [buttonDisableReport, setButtonDisableReport] = useState(false)
    const [selectedSupervisor, setSelectedSupervisor] = useState(null)

    //obtener lista unica de supervisores
    // const supervisors =[
    //     ...new Set(addCheckContact.map(contact => contact.Supervisor))
    // ].map(supervisor => ({ key: supervisor, text: supervisor, value: supervisor }))
    const supervisors = useMemo(
        () =>
            [...new Set(addCheckContact.map(contact => contact.Supervisor))].map(supervisor => ({
                key: supervisor,
                text: supervisor,
                value: supervisor,
            })),
        [addCheckContact]

    )

    //manejar los check 
    const handleCheckboxChange = (index) => {
        setDataSelect(prevData => prevData.map((item, indexOfData) =>
            indexOfData === index
                ? { ...item, checkToSend: !item.checkToSend }
                : item
        ))
    }

    //Boton de enviar 
    // const handleButtonCharge = async () => {
    //     //recorremos los contactos y manejamos las pormesas con Promise.all
    //     // eslint-disable-next-line
    //     const results = await Promise.all(filteredContacts.map(async (contact, index) => {  
    //         if (contact.checkToSend) {
    //             //filtramos los materiales por el almacen de contactos
    //             const resultByAlmacen = jsonData.filter(material => (contact.Almacén === material.Almacén) && contact.checkToSend)
    //             //llamamos a la API reportByNumber y obtenemos la respuesta
    //             const res = await reportByNumber(contact.Numero, contact.Nombre, resultByAlmacen)
    //             //actualizamos el estado de isSend para el contacto actual  
    //             setTimeout(() => {
    //                 setDataSelect(prevData => prevData.map((item, indexOfData) =>
    //                     indexOfData === index ? { ...item, isSend: res.messageSent } : item   
    //                 ))
    //             }, 100);

    //             console.log(res);               
    //             return res
    //         }
    //     }))
    //     if(results) setButtonDisableReport(!buttonDisableReport)
    // }
    const handleButtonCharge = async () => {
        try {
            const results = await Promise.all(
                filteredContacts.map(async (contact) => {
                    if (contact.checkToSend) {
                        const resultByAlmacen = jsonData.filter(
                            material => contact.Almacén === material.Almacén && contact.checkToSend
                        );
                        const res = await reportByNumber(contact.Numero, contact.Nombre, resultByAlmacen);

                        if (res.messageSent) {
                            //Actualizar estado con el identificador unico (almacen)
                            setDataSelect(prevData => prevData.map(item =>
                                item.Almacén === contact.Almacén ? { ...item, isSend: true } : item
                            ))
                        }
                        console.log(res)
                        return res;

                        // setDataSelect( prevData => prevData.map((item, indexOfData) => 
                        //     indexOfData === index ? { ...item, isSend: res.messageSent} : item
                        // ))
                    }
                })
            )
            if (results) setButtonDisableReport(!buttonDisableReport)
        } catch (error) {
            console.error("Error al enviar los reportes: ", error)
        }
    }


    //filtrar contactos por supervisor seleccionado
    // const filteredContacts = selectedSupervisor ?
    //     dataSelect.filter(contact => contact.Supervisor === selectedSupervisor)
    //     : dataSelect;
    const filteredContacts = useMemo(
        () =>
            selectedSupervisor ?
                dataSelect.filter(contact => contact.Supervisor === selectedSupervisor)
                : dataSelect,
        [dataSelect, selectedSupervisor]
    )

    //
    return (
        <div style={{ margin: '20px' }}>
            <Dropdown
                placeholder="Seleccionar Supervisor"
                fluid
                selection
                options={supervisors}
                onChange={(e, { value }) => setSelectedSupervisor(value)}
                clearable
            />
            <Table compact striped>
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell />
                        <TableHeaderCell>Almacén</TableHeaderCell>
                        <TableHeaderCell>Nombre</TableHeaderCell>
                        <TableHeaderCell>Numero</TableHeaderCell>
                        <TableHeaderCell>Supervisor</TableHeaderCell>
                        <TableHeaderCell>Enviado</TableHeaderCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredContacts.map((contact, index) => (
                        (contact.Numero && contact.Nombre) && (
                            <TableRow key={contact.Almacén}>
                                <TableCell>
                                    <Checkbox
                                        checked={contact.checkToSend} //establecer el estado si esta marcado
                                        onChange={() => handleCheckboxChange(index)}  //manejar los cambios
                                    />
                                </TableCell>
                                <TableCell>{contact.Almacén}</TableCell>
                                <TableCell>{contact.Nombre}</TableCell>
                                <TableCell>{contact.Numero}</TableCell>
                                <TableCell>{contact.Supervisor}</TableCell>
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
                    disabled={buttonDisableReport}
                    onClick={handleButtonCharge}
                >
                    Enviar Reporte
                </Button>
            )}
        </div>
    )
}
