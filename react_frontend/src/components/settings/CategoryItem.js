import React, {useState, useContext, useEffect, Fragment} from 'react'
import hexToRgba from 'hex-to-rgba'
import TransactionContext from '../../context/transaction/transactionContext'
import Spinner from '../layout/Spinner'

const CategoryItem = ({categoryItem}) => {
  const transactionContext = useContext(TransactionContext);
  const {categories, updateCategory} = transactionContext;

  const [category, setCategory] = useState('')

  const Submit = (e) => {
    e.preventDefault();
    updateCategory(category)
  }

  const onEdit = (e) => {
    if(e.target.tagName === "TD" && e.target.childNodes[1].className.includes("down")) {
      let dropdowns = document.getElementsByClassName("fa-chevron-up");
      for(let dropdown of dropdowns) {
        dropdown.className = "fas fa-chevron-down fa-2x";
        dropdown.parentNode.parentNode.nextSibling.childNodes[0].style.display = "none"
      }

      setCategory(categoryItem)
      e.target.parentNode.nextSibling.childNodes[0].style.display = "block"
      e.target.childNodes[1].className = "fas fa-chevron-up fa-2x"
    } else if(e.target.tagName === "I" && e.target.className.includes("down")) {
      let dropdowns = document.getElementsByClassName("fa-chevron-up");
      for(let dropdown of dropdowns) {
        dropdown.className = "fas fa-chevron-down fa-2x";
        dropdown.parentNode.parentNode.nextSibling.childNodes[0].style.display = "none"
      }
      
      setCategory(categoryItem)
      e.target.parentNode.parentNode.nextSibling.childNodes[0].style.display = "block"
      e.target.parentNode.childNodes[1].className = "fas fa-chevron-up fa-2x"
    } else if (e.target.tagName === "TD") {
      e.target.parentNode.nextSibling.childNodes[0].style.display = "none"
      e.target.childNodes[1].className = "fas fa-chevron-down fa-2x"
    } else {
      e.target.parentNode.parentNode.nextSibling.childNodes[0].style.display = "none"
      e.target.parentNode.childNodes[1].className = "fas fa-chevron-down fa-2x"
    }
  }

  const onChange = (e) => {
    setCategory({...categoryItem, [e.target.name]: e.target.value});
  }

  return (
    <Fragment>
      <tr key={categoryItem.categoryId}>
        <td onClick={onEdit}>
          <span className={"badge"} style={{backgroundColor:(hexToRgba(`#${categoryItem.categoryColor}`, '0.4'))}}>{categoryItem.categoryName}</span>
          <i style={{cursor: "pointer", float: "right"}} className="fas fa-chevron-down fa-2x"></i>
        </td>
      </tr>
      <tr>
        <td key={categoryItem.categoryId} style={{display: "none"}}>
            <span className="grid-2">
              <input type="text" name="categoryName" placeholder="Category Name" onChange={onChange}/>
              <input className="btn btn-dark btn-block" defaultValue="Save" onClick={Submit}/>
            </span>
        </td>
      </tr>
    </Fragment>
  )
}

export default CategoryItem