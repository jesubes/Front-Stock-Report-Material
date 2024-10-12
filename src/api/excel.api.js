// subir el archivo a /api/excel/json utilizando post
export const uploadFileExcel = async (file) =>{
    const formData = new FormData();
    formData.append('fileExcel', file)
    let data = {}
    try{
        const response = await fetch(`http://localhost:4000/api/excel/json`,{
            method: 'POST',
            body: formData
        })
        if(!response.ok) return [new Error(`Error uploadin file: ${response.statusText}`)]
        data = await response.json();

        return [undefined, data]
    }catch( error ){
        return [error, null]
    }
}


export const uploadFileContact = async (file) => {
    const formData = new FormData();
    formData.append('fileContact', file)
    let data = {}

    try{
        const response = await fetch(`http://localhost:4000/api/excel/contact`, {
            method: 'POST',
            body: formData
        })

        if(!response.ok) return [ new Error (`Error uploadin file: ${response.statusText}`)]
        data = await response.json();

        return [undefined, data]
    }catch ( error ) {
        return [error, null]
    }
}