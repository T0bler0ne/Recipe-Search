import './styles.css'
import { useContext } from 'react';
import { ThemeContext } from '../../App';

const FavoriteItem = (props)=>{
    const {id,image,title,removeFromFavourites}=props;
    const {theme}=useContext(ThemeContext)
    return(
        <div key={id} className="favorite-item">
            <div>
                <img src={image} width={300} alt="favorite image"/>
            </div>
            <p style={theme? {color:"#12343b"}:{}}>{title}</p>

            <button style={theme? {backgroundColor:"#12343b"}:{}} type='button' onClick={removeFromFavourites} >Remove from favourites</button>
        </div>
    );
};

export default FavoriteItem;