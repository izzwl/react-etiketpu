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
    const [create] = useCreate('berita');
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
        API_URL+'berita/aktivasi',{
            tgl_non_aktif: new Date(), id:record.id
        }
      ).then((response)=>{
        redirect('/berita');
        notify('Berita di nonaktifkan', 'info', {}, true);
        refresh();
      })
    }
    // const [approve, { loading }] = useUpdate(
    //     'berita',
    //     record.id,
    //     { tgl_non_aktif: new Date(), id:record.id },
    //     {
    //         undoable: true,
    //         onSuccess: ({ data }) => {
    //             redirect('/berita');
    //             notify('Berita di nonaktifkan', 'info', {}, true);
    //         },
    //         onFailure: (error) => notify(`Error: ${error.message}`, 'warning'),
    //     }
    // );
    return <Button label="Non Aktifkan" onClick={approve} ><Clear/></Button>;
};
const MyUrlField = ({ record = {}, source }) =>
    <a href={'http://'+record[source]}>
        {record[source]}
    </a>;

const TglField = ({ record = {}, source }) => {
    if (record[source]!==null) {
        return(<span>{record[source]}</span>);
    }
    return <span>-</span>
}
const UploadFoto = (e,data) => {
    // console.log(data);   
    let formdata = new FormData();
    formdata.set('foto',e);
    formdata.set('id',data.id);
    axios({
        url: API_URL+'berita/uploadfoto',
        method:'POST',
        data:formdata,
    }
    ).then((response)=>{
        
    })    
}    

const BeritaFilter = (props) => (
    <Filter {...props}>
        {/* <TextInput label="Search" source="q" alwaysOn /> */}
        <BooleanInput alwaysOn source="tgl_non_aktif" label="Berita Non Aktif" defaultValue={false} />
        {/* <ReferenceInput label="User" source="userId" reference="users" allowEmpty>
            <SelectInput optionText="name" />
        </ReferenceInput> */}
    </Filter>
);
export const BeritaList = (props) => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));
    return(
        <Card>
            <CardContent>
        <List {...props} title='Master Berita' className={'my-datagrid'} filters={<BeritaFilter/>} bulkActionButtons={false} exporter={true}>
            {isSmall ? (
            <SimpleList
                primaryText={record => record.judul}
                secondaryText={record => `${record.kode}`}
                tertiaryText={record => `${record.user_id}`}
            />
            ):(
            
            <Datagrid title={'Daftar Berita'} >
                {/* <TextField source="id" /> */}
                <TextField source="kode" />
                <TextField source="judul" />
                <TextField source="isi" />
                <TextField source="user_id" />
                <TextField emptyText='-' source="tgl_non_aktif" />
                <EditButton className={'action-button'} />
                <ApproveButton className={'action-button'} />
                {/* <TextField source="username" /> */}
                {/* <EmailField source="email" /> */}
                {/* <TextField source="address.street" /> */}
                {/* <MyUrlField source="website" /> */}
            </Datagrid>
            
            )}
        </List>
            </CardContent>
        </Card>                
    );
}

export const BeritaEdit = props => {
    const pr = props;
    let data = {
        id:pr.id,
        resource:pr.resource
    }
    return(
        <Edit {...props} title={'Ubah berita'} successMessage="Data berhasil diubah">
            <SimpleForm redirect="list"  encType={'multipart/form-data'} toolbar={<EditToolbar/>}>
                {/* <TextInput disabled hidden source="id" /> */}
                {/* <ReferenceInput source="userId" reference="users">
                <SelectInput optionText="name" />
                </ReferenceInput> */}
                <TextInput fullWidth={false} source="kode"/>
                <TextInput fullWidth={false} source="judul" />
                <RichTextInput fullWidth={false} multiline source="isi" />
                {/* <input type='file' source='foto' name='foto' /> */}

                <ImageInput source="foto" label="Foto berita" accept="image/*" onChange={(e)=>UploadFoto(e,data)}>
                    <ImageField source="src" title="foto" />
                </ImageInput>
            </SimpleForm>
        </Edit>
    )
};
export const BeritaCreate = props => (
    <Create {...props} title={'Buat berita'}>
        <SimpleForm redirect="list"  encType={'multipart/form-data'} toolbar={<EditToolbar/>}>
            {/* <TextInput disabled hidden source="id" /> */}
            {/* <ReferenceInput source="userId" reference="users">
               <SelectInput optionText="name" />
            </ReferenceInput> */}
            <TextInput fullWidth={false} source="kode" />
            <TextInput fullWidth={false} source="judul" />
            <RichTextInput fullWidth={false} multiline source="isi" />
           

        </SimpleForm>
    </Create>
);
export const BeritaShow = (props) => (
    <Show {...props} title={'Lihat berita'}>
        <SimpleShowLayout>
            <TextField source="kode" />
            <TextField source="judul" />
            <RichTextField source="isi" />

        </SimpleShowLayout>
    </Show>
);