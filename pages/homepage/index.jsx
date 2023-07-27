import { useReducer, useState,useContext, useCallback, useMemo } from "react";
import Search from "../../components";
import './styles.css'
import RecipeItem from "../../recipe-item";
import { useEffect } from "react";
import FavoriteItem from "../favorite-item";
import { ThemeContext } from "../../App";

const reducer = (state, action) => {        // video 16
    switch (action.type) {
        case 'filterFavourites':
            console.log(action);

            return{
                ...state,
                filteredValue: action.value,
            } ;

        default:
            return state;
    }
}

const initialState = {
    filteredValue: ''
}

const Homepage = () => {

    //loading state
    const [loadingState, setLoadingState] = useState(false)

    //save results that we receive from api
    const [recipes, setRecipes] = useState([])         //initially empty array

    //favourites data state
    const [favourites, setFavourites] = useState([])

    //state for api is succesfull or not
    const [apiCalledSuccess, setapiCalledSuccess] = useState(false)

    //use reducer functionality
    const [filteredState, dispatch] = useReducer(reducer, initialState)

    const {theme}=useContext(ThemeContext)


    const getDataFromSearchComponent = (getData) => {
        //keep loading state as true before we are calling the api
        setLoadingState(true);
        setRecipes([]);
        console.log(getData, 'getdata');

        //calling api

        async function getRecipes() {
            const apiResponse = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=acaf59d0fcc1463aba878431eeffc1dc&query=${getData}`);
            const result = await apiResponse.json()
            const { results } = result;           //destructuring
            
            if (results && results.length > 0) {
                console.log(recipes,"size");
                //set loading state as false again
                //set the recipes state
                setLoadingState(false);
                setRecipes(results);
                setapiCalledSuccess(true);
            }
            if (results.length===0){           /////////
                setLoadingState(false);
                setapiCalledSuccess(true);
            }

            console.log(results);
        }
        getRecipes()
    }
    //console.log(loadingState, recipes);     //warning otherwise

    const addToFavourites= useCallback((getCurrentRecipe)=>{
        let cpyFavourites = [...favourites];
        const index = cpyFavourites.findIndex(item => item.id === getCurrentRecipe.id)
        console.log(index);
        if (index === -1) {
            cpyFavourites.push(getCurrentRecipe)
            setFavourites(cpyFavourites)
            localStorage.setItem('favourites', JSON.stringify(cpyFavourites))
        }
        else {
            alert('Item already in favourites')
        }
    },[favourites])

    
    const removeFromFavourites = (getCurrentId) => {
        let cpyFavourites = [...favourites];
        cpyFavourites = cpyFavourites.filter((item) => item.id !== getCurrentId);
        setFavourites(cpyFavourites);
        localStorage.setItem("favourites", JSON.stringify(cpyFavourites));
    };


    useEffect(() => {
        const extactFavoritesFromLocalStorageOnPageLoad = JSON.parse(localStorage.getItem('favourites'));
        setFavourites(extactFavoritesFromLocalStorageOnPageLoad)
    }, [])

    console.log(favourites);

    //filter the favourites
    const filterFavouritesItems = favourites.filter((item) =>
        item.title.toLowerCase().includes(filteredState.filteredValue)
    );

    const renderRecipes =useCallback(()=>{
        if(recipes && recipes.length > 0){
            return(
                    recipes.map((item, index) => 
                    <RecipeItem 
                    addToFavourites={() => addToFavourites(item)} 
                    id={item.id} 
                    image={item.image} 
                    title={item.title} />)
            );
        }
    },[recipes,addToFavourites])
    //console.log(recipes.length,"size");
    //console.log(loadingState, "loading");

    const noitem=(recipes)=>{
        console.log(recipes.length,"size");
        if(!recipes.length){
            
            setLoadingState(false);
        }
    }
    
    return (
        <div className="homepage">
            <Search
                getDataFromSearchComponent={getDataFromSearchComponent}
                apiCalledSuccess={apiCalledSuccess}
                setapiCalledSuccess={setapiCalledSuccess}
            />

            {/* show favorites items */}
            <div className="favourites-wrapper">
                <h1 style={theme? {color:"#12343b"}:{}} className="favourites-title">Favorites</h1>

                <div className="search-favourites">
                    <input
                        onChange={(event) =>
                            dispatch({ type: "filterFavourites", value: event.target.value })
                        }
                        value={filteredState.filteredValue}
                        name="searchfavourites"
                        placeholder="Search Favourites" />

                </div>

                <div className="favourites">
                    {
                        !filterFavouritesItems.length &&<div style={{display:'flex',width:'100%',justifyContent:'center'}}  className="no-item">No favourites are found</div>
                    }
                    {
                        filterFavouritesItems && filterFavouritesItems.length > 0 ?      //favourites && favourites.length > 0 ?
                            filterFavouritesItems.map(item => (               //favourites.map(item => (
                                <FavoriteItem
                                    removeFromFavourites={() => removeFromFavourites(item.id)}
                                    id={item.id}
                                    image={item.image}
                                    title={item.title}
                                />
                            ))
                            : null
                    }
                </div>

            </div>
            {/* show favorites items */}

            {/* show loading state */}
            {
                loadingState && <div className="loading"> Loading recipes! Please wait.</div>
            }
            {/* show loading state */}

            {/* map through all the recipes */}
            <h1 style={theme? {color:"#12343b"}:{}} className="favourites-title">Search Results</h1>

            <div className="items">
                {/*renderRecipes()*/}   

                {
                    useMemo(()=>(
                        !loadingState && recipes && recipes.length?
                        recipes.map((item, index) => <RecipeItem addToFavourites={() => addToFavourites(item)} id={item.id} image={item.image} title={item.title} />)
                        : null
                    ),[loadingState,recipes,addToFavourites])

                }

                {/*
                    recipes && recipes.length > 0 ?
                        recipes.map((item, index) => <RecipeItem addToFavourites={() => addToFavourites(item)} id={item.id} image={item.image} title={item.title} />)
                        : null
        */}
            </div>
            
            {/* map through all the recipes */}
            
            
            {
                !recipes.length && !loadingState &&  <div noitem={()=> noitem(recipes)} className="no-item"> No recipes found</div>
            }


        </div>
    );
};
export default Homepage;