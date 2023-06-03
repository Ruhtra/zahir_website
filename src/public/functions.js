function removeEmptyValues(obj) {
    if (Array.isArray(obj)) { return obj.map((item) => removeEmptyValues(item)) } else if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
        Object.entries(obj)
        .filter(([_, value]) => value !== '')
        .map(([key, value]) => [
            key,
            typeof value === 'object' && value !== null ? removeEmptyValues(value) : value,
        ])
    );
    }
    return obj
}

export default {
    removeEmptyValues
}