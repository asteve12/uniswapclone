export const userSchema = {
    name: "Users",
    title: "Users",
    type: "document",
    fields: [
        {
            name: "address",
            title: "Wallet Address",
            type: "string",
            
        },
        {
            name: "userName",
            title: "User Name",
            type: "string",
            
        },
        {
            name: "transactions",
            title: "transactions",
            type: "array",
            of: [
                {
                    type: "reference",
                    to: [
                        {
                           type:"transaction" 
                        }
                    ]
                }
            ]
            
        }
        
    ]
}