import { Button, Card, CardActions, CardContent, Stack, Typography } from "@mui/material"



interface cardItem{
    id:string
    header:string
    content:string 
    actionTitle:string | null
    actions:()=>void
}


function CreateCard(c_content:cardItem){

    return<>
        <Card sx={{backgroundColor:'tan'}} >
            <Stack >
                <Typography sx={{color:'brown',fontStyle:'oblique'}} id={c_content.id.toString()}> {c_content.header}</Typography>
                <CardContent>{c_content.content}</CardContent>
                <CardActions>
                    <Button 
                    sx={{
                        backgroundColor:'beige',
                        marginLeft:'35%',
                        
                    }}
                    onClick={c_content.actions}>{c_content.actionTitle}</Button>
                </CardActions>
            </Stack>

        </Card>
    </>
}

export default CreateCard;