const arrayToCSV = <T extends {[k: string]: any}, A extends Array<T>>(array: T[]): string => {
    return array.map(t => 
        Object.values(t).join(';')
    ).join("\n")
}