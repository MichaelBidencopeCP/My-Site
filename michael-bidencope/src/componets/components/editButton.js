

import { SvgIcon } from "@mui/material";


function EditButtonIcon({selected, handleEdit})
{
    
    return (
        <SvgIcon onClick={() => {handleEdit(selected.index);}} style={{marginLeft:'6px'}}>
            <path d="m14.776 18.689 7.012-7.012c.133-.133.217-.329.217-.532 0-.179-.065-.363-.218-.515l-2.423-2.415c-.144-.143-.333-.215-.522-.215s-.378.072-.523.215l-7.027 6.996c-.442 1.371-1.158 3.586-1.265 3.952-.125.433.199.834.573.834.41 0 .696-.099 4.176-1.308zm-2.258-2.392 1.17 1.171c-.704.232-1.275.418-1.729.566zm.968-1.154 5.356-5.331 1.347 1.342-5.346 5.347zm-4.486-1.393c0-.402-.356-.75-.75-.75-2.561 0-2.939 0-5.5 0-.394 0-.75.348-.75.75s.356.75.75.75h5.5c.394 0 .75-.348.75-.75zm5-3c0-.402-.356-.75-.75-.75-2.561 0-7.939 0-10.5 0-.394 0-.75.348-.75.75s.356.75.75.75h10.5c.394 0 .75-.348.75-.75zm0-3c0-.402-.356-.75-.75-.75-2.561 0-7.939 0-10.5 0-.394 0-.75.348-.75.75s.356.75.75.75h10.5c.394 0 .75-.348.75-.75zm0-3c0-.402-.356-.75-.75-.75-2.561 0-7.939 0-10.5 0-.394 0-.75.348-.75.75s.356.75.75.75h10.5c.394 0 .75-.348.75-.75z"/>
        </SvgIcon>
    );
}

export { EditButtonIcon }