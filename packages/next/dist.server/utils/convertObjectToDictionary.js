
;// CONCATENATED MODULE: ./src/server/utils/convertObjectToDictionary.ts
const convertObjectToDictionary = (obj)=>{
    return new Map(Object.entries(obj).map(([k, v])=>{
        let value;
        if (typeof v === "boolean") {
            value = !!v;
        } else if (typeof v === "number") {
            value = v;
        } else {
            value = v.toString();
        }
        return [
            k,
            [
                value,
                new Map()
            ]
        ];
    }));
};

export { convertObjectToDictionary };
