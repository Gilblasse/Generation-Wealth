import React, {useEffect} from 'react'
import Modal from '@material-ui/core/Modal';


function LoadingPageModal({loading, percent}) {
    const [open, setOpen] = React.useState(loading);

    useEffect(() => {
        if(percent == 99){
            handleClose()
        }
    }, [percent])

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <Modal open={open} onClose={handleClose}>
            <div>Loading: {percent + '%'}</div>
        </Modal>
    )
}

export default LoadingPageModal
