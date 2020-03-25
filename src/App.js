import React from 'react';
import './App.css';
import { Admin, Resource, ListGuesser } from 'react-admin';
import { BeritaList, BeritaEdit, BeritaCreate, BeritaShow } from './berita';
import { KapalList, KapalEdit, KapalCreate, KapalShow } from './kapal';
import { UserList, UserEdit, UserCreate, UserShow } from './user';
import { PostList, PostEdit, PostCreate } from './post';
import { DirectionsBoat } from '@material-ui/icons'
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
class App extends React.Component{
  render(){
    return(
      <>
      <Admin dashboard={Home} dataProvider={etiketProvider} authProvider={authProvider}>
        <Resource options={{ label: 'User' }} name="system_user" icon={UserIcon} list={UserList} edit={UserEdit} create={UserCreate}  />
        <Resource options={{ label: 'Berita' }} name="berita" icon={PostIcon} list={BeritaList} edit={BeritaEdit} create={BeritaCreate}  />
        <Resource options={{ label: 'Kapal' }} name="master_kapal" icon={DirectionsBoat} list={KapalList} edit={KapalEdit} create={KapalCreate}  />
        {/* <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} /> */}
      </Admin>
      {/* <Admin dataProvider={dataProvider}>
        <Resource name="posts" list={PostList} />
      </Admin> */}
      </>
    )
  }
}
export default App;