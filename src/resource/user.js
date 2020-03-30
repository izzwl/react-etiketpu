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

export const userType = [
    { id: '1', name: 'Admin' },
    { id: '2', name: 'Operator' },
]

const SaveWithNoteButton = ({ handleSubmitWithRedirect, ...props }) => {
    const [create] = useCreate('system_user');
    const redirectTo = useRedirect();
    const notify = useNotify();
    const { basePath, redirect } = props;
    const form = useForm();
    const handleClick = useCallback(() => {
        // change the average_note field value
        // form.change('nama', 'dadang');
        handleSubmitWithRedirect(props.redirect);
    }, [form]);
    // override handleSubmitWithRedirect with custom logic
    return <SaveButton {...props} handleSubmitWithRedirect={handleClick} />;
};
const UserCreateToolbar = props => (
    <Toolbar {...props}>
        {/* <SaveButton
            label="save"
            redirect="list"
            submitOnEnter={true}
        /> */}
        <SaveWithNoteButton
            label="Save"
            redirect="list"
            submitOnEnter={true}
            // variant="text"
        />
    </Toolbar>
);
const UserEditToolbar = UserCreateToolbar;
const ApproveButton = ({ record }) => {
    const notify = useNotify();
    const redirect = useRedirect();
    const refresh = useRefresh();
    const approve = () => {
        return axios.post(
        API_URL+'system_user/aktivasi',{
            tgl_non_aktif: new Date(), id:record.id
        }
      ).then((response)=>{
        redirect('/system_user');
        notify('Data user di nonaktifkan', 'info', {}, true);
        refresh();
      })
    }
    return <Button label="Non Aktifkan" onClick={approve} ><Clear/></Button>;
};   
const UserFilter = (props) => (
    <Filter {...props}>
        {/* <TextInput label="Search" source="q" alwaysOn /> */}
        <BooleanInput
            alwaysOn
            source="tgl_non_aktif"
            label="User non aktif"
            defaultValue={false}
            />
        {/* <ReferenceInput label="User" source="userId" reference="users" allowEmpty>
            <SelectInput optionText="name" />
        </ReferenceInput> */}
    </Filter>
);
export const UserList = (props) => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));
    return(
        <Card>
            <CardContent>
        <List {...props} title='Master User' className={'my-datagrid'} filters={<UserFilter/>} bulkActionButtons={false} exporter={true}>
            {isSmall ? (
            <SimpleList
                primaryText={record => `${record.nama}`}
                secondaryText={record => `${record.user_id}`}
                tertiaryText={record => `${record.tipe}`}
            />
            ):(
            
            <Datagrid title={'Daftar User'} >
                <TextField source="nama" />
                <TextField source="user_id" />
                <SelectField source="tipe" choices={userType} />
                <EditButton className={'action-button'} />
                <ApproveButton className={'action-button'} />
            </Datagrid>
            
            )}
        </List>
            </CardContent>
        </Card>                
    );
}

export const UserEdit = props => {
    const pr = props;
    let data = {
        id:pr.id,
        resource:pr.resource
    }
    return(
        <Edit {...props} title={'Ubah berita'} successMessage="Data berhasil diubah">
            <SimpleForm redirect="list" toolbar={<UserEditToolbar/>}>
                <TextInput validate={[required()]} fullWidth={false} source="nama"/>
                {/* <TextInput validate={[required()]} label='Username' fullWidth={false} source="user_id" /> */}
                <SelectInput validate={[required()]} source="tipe" choices={userType} />
                <BooleanInput label='Super Admin' fullWidth={false} source="is_tambah_user" />
            </SimpleForm>
        </Edit>
    )
};

export const UserCreate = props => (
    <Create {...props} title={'Buat berita'} successMessage="Data berhasil dibuat">
        <SimpleForm redirect="list" toolbar={<UserCreateToolbar/>}>
            <TextInput validate={[required()]} fullWidth={false} source="nama" />
            <TextInput validate={[required()]} label='Username' fullWidth={false} source="user_id" />
            <SelectInput source="tipe" choices={userType} />
            <PasswordInput validate={[required()]} label='Password' fullWidth={false} source="pswd" />
            <BooleanInput label='Super Admin' initialValue={false} source="is_tambah_user" />
        </SimpleForm>
    </Create>
);
export const UserShow = (props) => (
    <Show {...props} title={'Lihat berita'}>
        <SimpleShowLayout>
            <TextField source="nama" />
            <TextField label='Username' source="user_id" />
            <SelectField source="tipe" choices={userType} />
            <BooleanField label='Super Admin' source="is_tambah_user" />

        </SimpleShowLayout>
    </Show>
);