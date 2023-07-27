import './styles.css'
import { useContext } from 'react';
import { ThemeContext } from '../App';

const RecipeItem = (props)=>{
    const {id,image,title,addToFavourites}=props;
    const {theme}=useContext(ThemeContext)
    return(
        <div key={id} className="recipe-item">
            <div>
                <img src={image} width={300} alt="recipe image" />
            </div>
            <p style={theme? {color:"#12343b"}:{}}>{title}</p>

            <button style={theme? {backgroundColor:"#12343b"}:{}} type='button' onClick={addToFavourites}>Add to favourites</button>
        </div>
    );
};

export default RecipeItem;