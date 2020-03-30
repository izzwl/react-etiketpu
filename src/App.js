import React from 'react';
import './App.css';
import { Admin, Resource, ListGuesser } from 'react-admin';
import { PelabuhanList, PelabuhanEdit, PelabuhanCreate, PelabuhanShow } from './resource/pelabuhan';
import { BeritaList, BeritaEdit, BeritaCreate, BeritaShow } from './resource/berita';
import { KapalList, KapalEdit, KapalCreate, KapalShow } from './resource/kapal';
import { UserList, UserEdit, UserCreate, UserShow } from './resource/user';
import { WisataList, WisataEdit, WisataCreate, WisataShow } from './resource/wisata';
import { BayarList, BayarEdit, BayarCreate, BayarShow } from './resource/bayar';
import { PostList, PostEdit, PostCreate } from './resource/post';
import { DirectionsBoat,LocationOn,Deck,LocalAtm } from '@material-ui/icons'
import PostIcon from '@material-ui/icons/Book';
import UserIcon from '@material-ui/icons/Group';
// import jsonServerProvider from 'ra-data-json-server';
import etiketProvider from './etiketProvider';
import beritaProvider from './beritaProvider';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import authProvider from './authProvider';
import { createMuiTheme } from '@material-ui/core/styles';
import { usePermissions } from 'react-admin';
// const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com');
// const etiketApiBerita = jsonServerProvider('http://localhost/e_tiket_api/public/berita/');
// const App = () => <Admin dataProvider={dataProvider} />;

const Home = () => (
  <Card>
      <CardHeader title="Welcome to the administration" />
      <CardContent>Lorem ipsum sic dolor amet...</CardContent>
  </Card>
);
const theme = createMuiTheme({
  palette: {
    type: 'dark', // Switching the dark mode on is a single property value change.
  },
});
const App = () => {

    // const { permissions } = usePermissions();
    // console.log(permissions)
    return(
      <>
      <Admin dashboard={Home} dataProvider={etiketProvider} authProvider={authProvider}>
        { permissions => [          
          <Resource 
            options={{ label:'User'}} 
            name="system_user" 
            icon={UserIcon} 
            list={ permissions.indexOf('Admin') !== -1 ? UserList : null } 
            edit={ permissions.indexOf('Admin') !== -1 ? UserEdit : null} 
            create={ permissions.indexOf('superadmin') !== -1 ? UserCreate : null }
          />,
          <Resource 
            options={{ label: 'Berita' }} 
            name="berita" 
            icon={ PostIcon } 
            list={ permissions.indexOf('Admin') !== -1 ? BeritaList : null } 
            edit={ permissions.indexOf('Admin') !== -1 ? BeritaEdit : null } 
            create={ permissions.indexOf('Admin') !== -1 ? BeritaCreate : null }  
          />,
          <Resource 
            options={{ label: 'Kapal' }} 
            name="master_kapal" 
            icon={DirectionsBoat} 
            list={ permissions.indexOf('Admin') !== -1 ? KapalList : null } 
            edit={ permissions.indexOf('Admin') !== -1 ? KapalEdit : null } 
            create={ permissions.indexOf('Admin') !== -1 ? KapalCreate : null }  
          />,
          <Resource 
            options={{ label: 'Pelabuhan' }} 
            name="master_pelabuhan" 
            icon={LocationOn} 
            list={ permissions.indexOf('Admin') !== -1 ? PelabuhanList : null } 
            edit={ permissions.indexOf('Admin') !== -1 ? PelabuhanEdit : null } 
            create={ permissions.indexOf('Admin') !== -1 ? PelabuhanCreate : null } 
          />,
          <Resource 
            options={{ label:'Wisata'}} 
            name="wisata" 
            icon={Deck} 
            list={ permissions.indexOf('Admin') !== -1 ? WisataList : null } 
            edit={ permissions.indexOf('Admin') !== -1 ? WisataEdit : null} 
            create={ permissions.indexOf('superadmin') !== -1 ? WisataCreate : null }
          />,
          <Resource 
            options={{ label:'Pembayaran'}} 
            name="master_bayar" 
            icon={LocalAtm} 
            list={ permissions.indexOf('Admin') !== -1 ? BayarList : null } 
            edit={ permissions.indexOf('Admin') !== -1 ? BayarEdit : null} 
            create={ permissions.indexOf('superadmin') !== -1 ? BayarCreate : null }
          />,
        ]}
      </Admin>
      </>
    )
}
export default App;