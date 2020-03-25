import etiketProvider from './etiketProvider';
import axios from 'axios';
const dataProvider = etiketProvider;

const beritaProvider = {
    ...dataProvider,
    update: (resource, params) => {
        // let { data } = params
        // data = {...data,foto:data.foto.rawFile}
        console.log(params);
        let formdata = new FormData();
        formdata.set('foto',params.data.foto);
        formdata.set('id',params.data.id);
        axios({
            url:'http://localhost/e_tiket_api/public/berita/uploadfoto',
            method:'POST',
            data:formdata,
            headers: { 'Content-Type': 'multipart/form-data' }
        }
        ).then((response)=>{
            
        })
        // if (params.data.foto) {
        //     // fallback to the default implementation
        //     // const upload = (foto) => {
        //     //     return axios({
        //     //         url:'http://localhost/e_tiket_api/public/berita/edit',
        //     //         method:'POST',
        //     //         data:{
        //     //             foto: foto
        //     //         }
        //     //     }
        //     //   ).then((response)=>{
                
        //     //   })
        //     // }
        //     // upload(params.data.foto);
            
            return dataProvider.update(resource,params);
        // }
        /**
         * For posts update only, convert uploaded image in base 64 and attach it to
         * the `picture` sent property, with `src` and `title` attributes.
         */
        
        // Freshly dropped foto are File objects and must be converted to base64 strings
        // const newPictures = params.data.foto.filter(
        //     p => p.rawFile instanceof File
        // );
        // const formerPictures = params.data.foto.filter(
        //     p => !(p.rawFile instanceof File)
        // );

        // return Promise.all(newPictures.map(convertFileToBase64))
        //     .then(base64Pictures =>
        //         base64Pictures.map(picture64 => ({
        //             src: picture64,
        //             title: `${params.data.title}`,
        //         }))
        //     )
        //     .then(transformedNewPictures =>
        //         dataProvider.update(resource, {
        //             ...params,
        //             data: {
        //                 ...params.data,
        //                 foto: [
        //                     ...transformedNewPictures,
        //                     ...formerPictures,
        //                 ],
        //             },
        //         })
        //     );
    },
};

/**
 * Convert a `File` object returned by the upload input into a base 64 string.
 * That's not the most optimized way to store images in production, but it's
 * enough to illustrate the idea of data provider decoration.
 */
const convertFileToBase64 = file =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.rawFile);

        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
    });

export default beritaProvider;