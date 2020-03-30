import React from 'react';
import { 
    List, Edit, Create, Show, DatagridBody, Datagrid, TextField, EmailField, UrlField, 
    EditButton, SimpleForm, TextInput, Filter, ReferenceInput, SelectInput,
    SimpleList, SimpleShowLayout, RichTextField, BooleanInput, ImageField,
    ImageInput,FileField,FileInput
} from 'react-admin';
import { useMediaQuery } from '@material-ui/core';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { useRefresh, useNotify, useRedirect, Button } from 'react-admin';
import {Clear} from '@material-ui/icons'
import axios from 'axios';
import { API_URL } from '../settings';

const ApproveButton = ({ record }) => {
    const notify = useNotify();
    const redirect = useRedirect();
    const refresh = useRefresh();
    const approve = () => {
        return axios.post(
        API_URL+'master_kapal/aktivasi',{
            tgl_non_aktif: new Date(), id:record.id
        }
      ).then((response)=>{
        redirect('/master_kapal');
        notify('Data kapal di nonaktifkan', 'info', {}, true);
        refresh();
      })
    }
    return <Button label="Non Aktifkan" onClick={approve} ><Clear/></Button>;
};   

const KapalFilter = (props) => (
    <Filter {...props}>
        {/* <TextInput label="Search" source="q" alwaysOn /> */}
        <BooleanInput
            alwaysOn
            source="tgl_non_aktif"
            label="Kapal Non Aktif"
            defaultValue={false}
            />
        {/* <ReferenceInput label="User" source="userId" reference="users" allowEmpty>
            <SelectInput optionText="name" />
        </ReferenceInput> */}
    </Filter>
);
export const KapalList = (props) => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));
    return(
        <Card>
            <CardContent>
        <List {...props} title='Master Kapal' className={'my-datagrid'} filters={<KapalFilter/>} bulkActionButtons={false} exporter={true}>
            {isSmall ? (
            <SimpleList
                primaryText={record => `${record.kode} - ${record.nama}`}
                secondaryText={record => `${record.jenis}`}
                tertiaryText={record => `${record.tgl_non_aktif}`}
            />
            ):(
            
            <Datagrid title={'Daftar Kapal'} >
                <TextField source="kode" />
                <TextField source="nama" />
                <TextField source="jenis" />
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

export const KapalEdit = props => {
    const pr = props;
    let data = {
        id:pr.id,
        resource:pr.resource
    }
    return(
        <Edit {...props} title={'Ubah berita'} successMessage="Data berhasil diubah">
            <SimpleForm redirect="list" >
                <TextInput fullWidth={false} source="kode"/>
                <TextInput fullWidth={false} source="nama" />
                <TextInput fullWidth={false} source="jenis" />
            </SimpleForm>
        </Edit>
    )
};
export const KapalCreate = props => (
    <Create {...props} title={'Buat berita'}>
        <SimpleForm redirect="list" >
            <TextInput fullWidth={false} source="kode" />
            <TextInput fullWidth={false} source="nama" />
            <TextInput fullWidth={false} source="jenis" />
        </SimpleForm>
    </Create>
);
export const KapalShow = (props) => (
    <Show {...props} title={'Lihat berita'}>
        <SimpleShowLayout>
            <TextField source="kode" />
            <TextField source="nama" />
            <TextField source="jenis" />
        </SimpleShowLayout>
    </Show>
);