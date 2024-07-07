import useHttp from "../hooks/useHttp";
import Error from "./Error";
import MealItem from "./MealItem";

const requestConfig = {}
const Meals = () => {
  const { data : loadedMeals , isLoading ,error} = useHttp('http://localhost:3000/meals' , requestConfig ,[])


    if(isLoading) {
      return <h3 className="center">Fetching meals...</h3>
    }

    if(error) {
      return <Error title='Failed to fetch meals' message={error} />
    }
  return (
    <>
      <ul id="meals">
        {loadedMeals.map((meal) => {
          return <MealItem key={meal.id} meal={meal} />
        })}
      </ul>
    </>
  );
};

export default Meals;
