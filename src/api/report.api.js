
export const reportByNumber = async (number, name, jsonData) => {

    let data = {}
    try{
        const response = await fetch(`http://localhost:4000/api/report?number=${number}&name=${name}`, {
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData),
        })
        if(!response.ok) return [new Error(`Error uploadin file: ${response.statusText}`)]
        data = await response.json()

        return data 

    }catch (error){
        console.error(error);
    }
}