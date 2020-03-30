import React, { useCallback } from 'react';
import { 
    required, List, Edit, Create, Show, DatagridBody, Datagrid, TextField, EmailField, UrlField, 
    EditButton, SimpleForm, TextInput, Filter, ReferenceInput, SelectInput,
    SimpleList, SimpleShowLayout, RichTextField, BooleanInput, ImageField,
    ImageInput,FileField,FileInput,PasswordInput,BooleanField,SelectField, SaveButton,
    Toolbar,
} from 'react-admin';
import { useMediaQuery } from '@material-ui/core';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { useRefresh, useNotify, useRedirect, useCreate, Button } from 'react-admin';
import { useForm } from 'react-final-form';
import {Clear} from '@material-ui/icons'
import axios from 'axios';
import { API_URL } from '../settings';
const bayarJenis = [
    { id: '1', name: 'Gerai Retail' },
    { id: '2', name: 'Kartu Kredit / Debit Online' },
    { id: '3', name: 'ATM / Mobile Banking / Internet Banking' },
]

const SaveWithNoteButton = ({ handleSubmitWithRedirect, ...props }) => {
    const [create] = useCreate('master_bayar');
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
    <Toolbar {...props}> <SaveWithNoteButton label="Save" redirect="list" submitOnEnter={true} /* variant="text" */ /></Toolbar>
);
const EditToolbar = CreateToolbar;
const ApproveButton = ({ record }) => {
    const notify = useNotify();
    const redirect = useRedirect();
    const refresh = useRefresh();
    const approve = () => {
        return axios.post(
        API_URL+'master_bayar/aktivasi',{
            tgl_non_aktif: new Date(), id:record.id
        }
      ).then((response)=>{
        redirect('/master_bayar');
        notify('Data bayar di nonaktifkan', 'info', {}, true);
        refresh();
      })
    }
    return <Button label="Non Aktifkan" onClick={approve} ><Clear/></Button>;
};   
const BayarFilter = (props) => (
    <Filter {...props}>
        <BooleanInput alwaysOn source="tgl_non_aktif" label="Bayar non aktif" defaultValue={false} />
        <SelectInput label="Jenis" source="jenis" choices={bayarJenis} allowEmpty />
    </Filter>
);
export const BayarList = (props) => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));
    return(
        <Card>
            <CardContent>
        <List {...props} title='Master Bayar' className={'my-datagrid'} filters={<BayarFilter/>} bulkActionButtons={false} exporter={true}>
            {isSmall ? (
            <SimpleList
                primaryText={record => `${record.kode} - ${record.nama}`}
                secondaryText={record => `${record.jenis}`}
                tertiaryText={record => `${record.user_id}`}
            />
            ):(
            
            <Datagrid title={'Daftar Bayar'} >
                <TextField source="kode" />
                <TextField source="nama" />
                <SelectField source="jenis" choices={bayarJenis} />
                <TextField source="user_id" />
                <EditButton className={'action-button'} />
                <ApproveButton className={'action-button'} />
            </Datagrid>
            
            )}
        </List>
            </CardContent>
        </Card>                
    );
}

export const BayarEdit = props => {
    return(
        <Edit {...props} title={'Ubah berita'} successMessage="Data berhasil diubah">
            <SimpleForm redirect="list" toolbar={<EditToolbar/>}>
                <TextInput validate={[required()]} fullWidth={false} source="kode"/>
                <TextInput validate={[required()]} fullWidth={false} source="nama"/>
                <SelectInput validate={[required()]} source="jenis" choices={bayarJenis} />
            </SimpleForm>
        </Edit>
    )
};

export const BayarCreate = props => (
    <Create {...props} title={'Buat berita'} successMessage="Data berhasil dibuat">
        <SimpleForm redirect="list" toolbar={<CreateToolbar/>}>
            <TextInput validate={[required()]} fullWidth={false} source="kode" />
            <TextInput validate={[required()]} fullWidth={false} source="nama" />
            <SelectInput source="jenis" choices={bayarJenis} />
        </SimpleForm>
    </Create>
);
export const BayarShow = (props) => (
    <Show {...props} title={'Lihat berita'}>
        <SimpleShowLayout>
            <TextField source="kode" />
            <TextField source="nama" />
            <SelectField source="jenis" choices={bayarJenis} />
        </SimpleShowLayout>
    </Show>
);