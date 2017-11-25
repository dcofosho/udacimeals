import React, { Component } from 'react';
import { connect } from 'react-redux'
import { addRecipe, removeFromCalendar} from '../actions'
import { capitalize } from '../utils/helper'
import CalendarIcon from 'react-icons/lib/fa/calendar-plus-o'
import Modal from 'react-modal'
import Loading from 'react-loading'
import ArrowRightIcon from 'react-icons/lib/fa/arrow-circle-right'
import { fetchRecipes } from '../utils/api'
import FoodList from './FoodList.js'
import ShoppingList from './ShoppingList.js'

class App extends Component {
	state={
		foodModalOpen: false,
		meal: null,
		day: null,
		food: null,
		loadingFood: false,
		ingredientsModalOpen: false,
	}
	openFoodModal = ({meal, day})=>{
		this.setState(()=>({
			//open the food modal
			foodModalOpen: true,
			//if a food modal is open, then (and only then),
			//meal (e.g. breakfast) and day (e.g. sunday)
			//values are set in the local state so that the modal can say
			//"find a meal for sunday breakfast"
			meal,
			day,
		}))
	}
	closeFoodModal = () => {
		this.setState(()=>({
			foodModalOpen: false,
			//when the food modal is closed, the "meal" and "food"
			//values in the local state are set back to null
			meal: null,
			day: null,
		}))
	}
	openIngredientsModal = ()=>{
		this.setState(()=>({
			ingredientsModalOpen: true,
		}))
	}
	closeIngredientsModal = ()=>{
		this.setState(()=>({
			ingredientsModalOpen: false,
		}))
	}

	//generate array of ingredients from meals
	generateShoppingList = () => {
		//use reduce to build up an array of meals from the calendar
		return this.props.calendar.reduce((result, {meals})=>{
			const {breakfast, lunch, dinner} = meals
			breakfast && result.push(breakfast)
			lunch && result.push(lunch)
			dinner && result.push(dinner)

			return result
			//use reduce again to build up an array of ingredients from the meals
		}, []).reduce((ings, { ingredientLines})=>ings.concat(ingredientLines),[])
	}
	searchFood = (e)=>{
		if(!this.input.value){
			return
		}

		e.preventDefault()
		this.setState(()=>({ loadingFood: true }))
		//call the api fetch recipes function, and set state.food equal to the result,
		//(this is the only time there is a food property in the local state) and
		//state.loadingFood to false
		fetchRecipes(this.input.value).then((food)=>this.setState(()=>({
				food,
				loadingFood: false,
			})))
	}
	render() {
		//determine whether food/ingredient modals are open from state
		const { foodModalOpen, loadingFood, food, ingredientsModalOpen } = this.state
		const { calendar, remove, selectRecipe } = this.props
		const mealOrder = ['breakfast', 'lunch', 'dinner']
		return (
			<div className='container'>
			<div className='nav'>
				<h1 className='header'>Udacimeals</h1>
				<button 
					className='shopping-list'
					onClick={this.openIngredientsModal}>
					Shopping List
				</button>
			</div>
				<ul className='meal-types'>
					{	//this horizontally styled ul is generated by 
						//mapping over the mealOrder array
						//i.e. "breakfast", "lunch", and "dinner".
						//This is the "x-axis" of our table
						mealOrder.map((mealType)=>
						<li key={mealType} className='subheader'>{capitalize(mealType)}</li>
					)}
				</ul>

				<div className='calendar'>
					<div className='days'>
						{	//this vertically styled ul is generated by 
							//mapping over the days of the week
							//This is the "y-axis" of our table
							calendar.map(({ day })=> <h3 key={day} className="subheader">{capitalize(day)}</h3>)}
					</div>
					<div className='icon-grid'>
						{//This grid contains three icons (breakfast/lunch/dinner)
						// for each day of the week. It is generated
						// by mapping over meals for each day in the calendart.
						//If a particular meal (e.g. breakfast)
						//exists in the store for a particular day (e.g. sunday)
						//then an image of the meal (fetched with the api) is shown.
						//if not, then an icon is shown, with an onClick which opens the
						//food modal, allowing the user to select a meal for that day
							calendar.map(({day,meals})=>(
							<ul key={day}>
								{mealOrder.map((meal)=>(
									<li key={meal} className='meal'> 
										{meals[meal]
											?	<div className='food-item'>
													<img src={meals[meal].image} alt={meals[meal].label}/>
													<button onClick={()=>remove({meal, day})}>Clear</button>
												</div>
											: 	<button onClick={()=>this.openFoodModal({meal, day})}className='icon-btn'>
													<CalendarIcon size={30}/>
												</button>
										}
									</li>
								))}
							</ul>

						))}
					</div>
				</div>
				{/*
					This is the food modal. It is open when the state foodModalOpen
					property is equal to true, i.e. when the user clicks on the calendar icon
				*/}
				<Modal
		          className='modal'
		          overlayClassName='overlay'
		          isOpen={foodModalOpen}
		          onRequestClose={this.closeFoodModal}
		          contentLabel='Modal'
		        >
		          <div>
		            {//when the state loadingFood property is true, then the spinner is shown..
		            loadingFood === true
		              ? <Loading delay={200} type='spin' color='#222' className='loading' />
		              	//..otherwise, the actual modal is shown
		              : <div className='search-container'>
		                  <h3 className='subheader'>
		                    Find a meal for {capitalize(this.state.day)} {this.state.meal}.
		                  </h3>
		                  <div className='search'>
		                  	{/* 
		                  		This is the modal input, where
								the user can search for food. Clicking the arrow button
								runs the searchFood function
		                  	*/}
		                    <input
		                      className='food-input'
		                      type='text'
		                      placeholder='Search Foods'
		                      ref={(input) => this.input = input}
		                    />
		                    <button
		                      className='icon-btn'
		                      onClick={this.searchFood}>
		                        <ArrowRightIcon size={30}/>
		                    </button>
		                  </div>
		              		{/*
								If the user clicks the arrow button,
								and the searchFood function returns a non-null
								food, then the food is passed as a prop to a new
								FoodList component. The FoodList component simply shows
								the image and label for each recipe.
								When an item in the food list is selected, the selectRecipe function
								dispatches the addRecipe action, adds the new recipe to the store,
								and closes the food modal.
		              		*/}
		                  {food !== null && (
		                    <FoodList
		                      food={food}
		                      onSelect={(recipe) => {
		                        selectRecipe({ recipe, day: this.state.day, meal: this.state.meal })
		                        this.closeFoodModal()
		                      }}
		                    />)}
		                </div>}
		          </div>
				</Modal>

			{/*
			This is the ingredients modal. It is open when the state ingredientsModalOpen property is true, 
			i.e. when the user clicks the shopping cart button in the nav bar. 
			This calls the generateShoppingList function to generate a list of ingredients from the state calendar,
			then passes this list as props to a new ShoppingList component, which is a simple ul generate from the list.
			*/}
				<Modal
		          className='modal'
		          overlayClassName='overlay'
		          isOpen={ingredientsModalOpen}
		          onRequestClose={this.closeIngredientsModal}
		          contentLabel='Modal'
		        >
		        	{ingredientsModalOpen && <ShoppingList list={this.generateShoppingList()}/>}
		        </Modal>
			</div>
    );
  }
}

/*
map store calendar and food to props

the calendar object  will look like this:
{
	monday:{
		breakfast: 'eggs benedict', <<just has ID of food
		lunch: 'mango smoothie',
		dinner: 'chicken marsala'
	},
	...
}

the food object will look like
	{
		eggsBenedict:{
			INFO
		}
	}


*/
function mapStateToProps({ calendar, food }){
	const dayOrder = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
	//return object containing array of objects, one for each day
	return{
		//map over days
		calendar: dayOrder.map((day)=>({
			day,
			//use reduce function to build up object containing meals for the day
			meals: Object.keys(calendar[day]).reduce((meals, meal)=>{
				/*
				e.g. if calendar[sunday][breakfast] exists (say it's eggs benedict),
				then meals[meal] = food[calendar[sunday][breakfast]
				*/
				meals[meal] = calendar[day][meal]
					? food[calendar[day][meal]]
					/*if calendar[sunday][breakfast] doesn't exist, then 
					meals[breakfast] = null for Sunday.
					*/
					: null
				return meals
			},{})
		}))
	}
}

/*bind addRecipe and removeFromCalendar to dispatch before they
ever hit the component. The UI can dispatch these actions
with the selectRecipe and remove functions 
*/
function mapDispatchToProps(dispatch){
	return{
		selectRecipe: (data)=>dispatch(addRecipe(data)),
		remove: (data)=>dispatch(removeFromCalendar(data))
	}
}

//connect App component props to store and action creators
export default connect(mapStateToProps, mapDispatchToProps)(App)
