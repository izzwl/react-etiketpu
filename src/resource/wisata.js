import React , {useCallback} from 'react';
import { 
    List, Edit, Create, Show, DatagridBody, Datagrid, TextField, EmailField, UrlField, 
    EditButton, SimpleForm, TextInput, Filter, ReferenceInput, SelectInput,
    SimpleList, SimpleShowLayout, RichTextField, BooleanInput, ImageField,
    ImageInput,FileField,FileInput,SaveButton,Toolbar
} from 'react-admin';
import RichTextInput from 'ra-input-rich-text';
import { useMediaQuery } from '@material-ui/core';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { useRefresh, useNotify, useRedirect, Button, useCreate } from 'react-admin';
import { useForm } from 'react-final-form';

import {Clear} from '@material-ui/icons'
import axios from 'axios';
import { API_URL } from '../settings';

const SaveWithNoteButton = ({ handleSubmitWithRedirect, ...props }) => {
    const [create] = useCreate('wisata');
    const redirectTo = useRedirect();
    const notify = useNotify();
    const { basePath, redirect } = props;
    const form = useForm();
    const handleClick = useCallback(() => {
        // change the average_note field value
        form.change('user_id', localStorage.getItem('username'));
        handleSubmitWithRedirect(props.redirect);
    }, [form]);
    // override handleSubmitWithRedirect with custom logic
    return <SaveButton {...props} handleSubmitWithRedirect={handleClick} />;
};
const CreateToolbar = props => (
    <Toolbar {...props}><SaveWithNoteButton label="Save" redirect="list" submitOnEnter={true} /*variant="text"*/ /></Toolbar>
);
const EditToolbar = CreateToolbar;

const ApproveButton = ({ record }) => {
    const notify = useNotify();
    const redirect = useRedirect();
    const refresh = useRefresh();
    const approve = () => {
        return axios.post(
        API_URL+'wisata/aktivasi',{
            tgl_non_aktif: new Date(), id:record.id
        }
      ).then((response)=>{
        redirect('/wisata');
        notify('Wisata di nonaktifkan', 'info', {}, true);
        refresh();
      })
    }
    return <Button label="Non Aktifkan" onClick={approve} ><Clear/></Button>;
};
const UploadFoto = (e,data) => {
    // const notify = useNotify();
    // console.log(data);   
    let formdata = new FormData();
    formdata.set('foto',e);
    formdata.set('id',data.id);
    axios({
        url: API_URL+data.resource+'/uploadfoto',
        method:'POST',
        data:formdata,
    }
    ).then((response)=>{
        // notify('Foto berhasil diupload', 'info', {}, true);
    })    
}    

const WisataFilter = (props) => (
    <Filter {...props}>
        {/* <TextInput label="Search" source="q" alwaysOn /> */}
        <BooleanInput alwaysOn source="tgl_non_aktif" label="Wisata Non Aktif" defaultValue={false} />
        {/* <ReferenceInput label="User" source="userId" reference="users" allowEmpty>
            <SelectInput optionText="name" />
        </ReferenceInput> */}
    </Filter>
);
export const WisataList = (props) => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));
    return(
        <Card>
            <CardContent>
        <List {...props} title='Master Wisata' className={'my-datagrid'} filters={<WisataFilter/>} bulkActionButtons={false} exporter={true}>
            {isSmall ? (
            <SimpleList
                primaryText={record => record.judul}
                secondaryText={record => `${record.kode}-${record.nama_pulau}`}
                tertiaryText={record => `${record.user_id}`}
            />
            ):(
            <Datagrid title={'Daftar Wisata'} >
                {/* <TextField source="id" /> */}
                <TextField source="kode" />
                <TextField source="judul" />
                <TextField source="nama_pulau" />
                <RichTextField source="fasilitas" />
                <TextField source="user_id" />
                <TextField emptyText='-' source="tgl_non_aktif" />
                <EditButton className={'action-button'} />
                <ApproveButton className={'action-button'} />
            </Datagrid>
            )}
        </List>
            </CardContent>
        </Card>                
    );
}

export const WisataEdit = props => {
    const pr = props;
    let data = {
        id:pr.id,
        resource:pr.resource
    }
    return(
        <Edit {...props} title={'Ubah wisata'} successMessage="Data berhasil diubah">
            <SimpleForm redirect="list"  encType={'multipart/form-data'} toolbar={<EditToolbar/>}>
                <TextInput fullWidth={false} source="kode"/>
                <TextInput fullWidth={false} source="judul" />
                <TextInput fullWidth={false} source="nama_pulau" />
                <RichTextInput fullWidth={false} multiline source="fasilitas" />
                <ImageInput source="foto" label="Foto wisata" accept="image/*" onChange={(e)=>UploadFoto(e,data)}>
                    <ImageField source="src" title="foto" />
                </ImageInput>
            </SimpleForm>
        </Edit>
    )
};
export const WisataCreate = props => (
    <Create {...props} title={'Buat wisata'}>
        <SimpleForm redirect="list"  encType={'multipart/form-data'} toolbar={<CreateToolbar/>}>
            <TextInput fullWidth={false} source="kode" />
            <TextInput fullWidth={false} source="judul" />
            <TextInput fullWidth={false} source="nama_pulau" />
            <RichTextInput fullWidth={false} multiline source="fasilitas" />
        </SimpleForm>
    </Create>
);
export const WisataShow = (props) => (
    <Show {...props} title={'Lihat wisata'}>
        <SimpleShowLayout>
            <TextField source="kode" />
            <TextField source="judul" />
            <TextField source="nama_pulau" />
            <RichTextField source="fasilitas" />
        </SimpleShowLayout>
    </Show>
);