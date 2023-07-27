import { useContext, useEffect, useState } from 'react';
import './styles.css'
import { ThemeContext } from '../App';

// 'state' management through hooks
// useState
//useReducer -> complex state

const Search = (props) => {
    const {getDataFromSearchComponent,apiCalledSuccess,setapiCalledSuccess}= props;

    const [inputValue, setInputValue] = useState('')   //initial value

    const {theme}=useContext(ThemeContext)

    const handleInputvalue = (event)=>{
        //console.log(event,"eventing");
        const {value}= event.target;
        //set the updated state
        setInputValue(value)
    }
    
    
    const handleSubmit= (event) =>{
        
        event.preventDefault()
        getDataFromSearchComponent(inputValue)
    }
    console.log(apiCalledSuccess,"api");
    useEffect(()=>{
        //if(apiCalledSuccess){
            console.log('hereee');
            setInputValue('')
            setapiCalledSuccess(false)
            
        //}
    },[apiCalledSuccess,setapiCalledSuccess])
    
    return (
        <form onSubmit={handleSubmit} className="Search">                                                                     {/*passing input to homepage */}
            <input name="search" onChange={handleInputvalue} value={inputValue} placeholder="Search Recipes" id="search" />   {/*taking input*/}
            <button style={theme? {backgroundColor:"#12343b"}:{}} type="submit">Search</button>
        </form>   //submit and refresh
    );
};
export default Search;