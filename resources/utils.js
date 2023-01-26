export function headerFormatter(arrStr){
    const result = []
    for (let item of arrStr){
        result.push(
            item
                .replace("(", "")
                .replace(")", "")
                .replace(" ", "_")
                .replace(" ", "_")
                .replace(" ", "_")
                .toLowerCase()
        )
    }
    return result
}