


const extractElements = (array, start, end, section) => {
    let startIndex = -1;
    let endIndex = -1;

    // Encontrar los índices de los elementos de inicio y fin

    for (let i = 0; i < array.length; i++) {
        if (array[i].Value === start){
            startIndex = i;
        }
        if (array[i].Value === end) {
            endIndex = i;
        }
    }

    // Si no se encuentran ambos elementos, devolver un array vacío
    if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
        return [];
    }

    // Extraer los elementos entre los índices encontrados excluyendo los elementos buscados
    let extractedArray  =  array.slice(startIndex-1, endIndex);
    // Extraer los elementos entre los índices encontrados incluyendo los elementos buscados
    const updatedExtractedArray = extractedArray.map(item => ({
        ...item,
        Header: section
    }));

    return updatedExtractedArray
}

const extractElementsRange = (array, end) => {
    let startIndex = 27;
    let endIndex = -1;

    // Encontrar los índices de los elementos de inicio y fin

    for (let i = 0; i < array.length; i++) {
        if (array[i].Value === end) {
            endIndex = i;
        }
    }

    // Si no se encuentran ambos elementos, devolver un array vacío
    if ( endIndex === -1 || startIndex >= endIndex) {
        return [];
    }

    // Extraer los elementos entre los índices encontrados excluyendo los elementos buscados
    let extractedArray  =  array.slice(startIndex, endIndex);

    return extractedArray
}


module.exports = {
    extractElements,
    extractElementsRange
}