const request = async (url) => {
    let response = await fetch(url);
    return await response.json();
}

const users = async () => await request('https://jsonplaceholder.typicode.com/users');
const postUsers = async (userId) => await request(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
const commentsPost = async (postId) => await request(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);

const load = async () => {
    
    const arrayPrincipal = [];
    let usuarios = await users();    
    let arrayPosts = [];
    
    for (const usuario of usuarios) {
        arrayPosts.push(postUsers(usuario.id));
    }
    
    let responsePosts = await Promise.all(arrayPosts);
    
    for (let i = 0; i < responsePosts.length; i++) {
        let postsDelUsuario = responsePosts[i];
        let commentsDelUsuario = [];
        
        for (const post of postsDelUsuario) {
            commentsDelUsuario.push(commentsPost(post.id));
        }
        
        let responseCommentsUsuario = await Promise.all(commentsDelUsuario);
        
        arrayPrincipal[i] = {
            posicion: i,
            usuario: usuarios[i].id,
            posts: postsDelUsuario.map(post => post.id),
            comentarios: responseCommentsUsuario.map(comments => 
                comments.map(comment => comment.id)
            )
        };
    }
    
    arrayPrincipal.forEach((datos, index) => {
        console.log('\nPosición:', index);
        console.log('Usuario ID:', datos.usuario);
        console.log('Posts IDs:', datos.posts);
        console.log('Comentarios IDs por post:', datos.comentarios);
    });
    
    return arrayPrincipal;
}

load();