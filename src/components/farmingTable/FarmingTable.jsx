import React,{useEffect} from "react";
import DataTable from "react-data-table-component";
import styled, { ThemeProvider } from "styled-components";
import harvest from "../../lib/index";
import { darkTheme, lightTheme, fonts } from "../../styles/appStyles";


import FarmTableSkeleton from './FarmTableSkeleton';
import NotStaking from './NotStaking';


const { utils } = harvest;

const TableContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 99%:
  padding-bottom: 3rem;
  border: ${(props) => props.theme.style.mainBorder};
  box-shadow: ${(props) => props.theme.style.panelBoxShadow};
  color: ${(props) => props.theme.style.primaryFontColor};
  background-color: ${(props) => props.theme.style.lightBackground};
  border-radius: .5rem;
  

  



  
`;



const MainTableInner = styled.div`
  width: 100%;
  margin: 0 auto;
  overflow-x: scroll;
  scrollbar-color: ${(props) => props.theme.style.blueBackground} ${(props) => props.theme.style.lightBackground} ;
  scrollbar-width: thin;
  ::-webkit-scrollbar {
    width: 100%;
    height: .8rem;
    margin-top: -1.8rem
    
  }
  ::-webkit-scrollbar-track:no-button { 
    width: 100%;
    border-radius: .5rem;
    background-color: ${(props) => props.theme.style.lightBackground};
  }
  ::-webkit-scrollbar-button {
    color: ${(props) => props.theme.style.primaryFontColor};
    
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: black;
    background-color: ${(props) => props.theme.style.blueBackground};
 }
`;
const MainTableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr ;
  font-size: 1.7rem;
  font-family: ${fonts.contentFont};
  padding: 1.5rem 1rem;
  width: 100%;
  border-bottom: 1px solid black;
  @media(max-width: 1100px) {
    width: 120%;
  }
  @media(max-width: 700px) {
    width: 300%;
  }
  
  
  div {
    
    min-width: 5rem;
  }
  .active {
    margin-left: 2rem;
  }
  .rewards {
    cursor: pointer;
  }
  .pool {
    margin-left: 2rem;
  }
  .unstaked {
    margin-left: 1rem;
  }
  .value {
    margin-left: 2rem;
  }
`;
const MainTableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr ;
  grid-gap: 20px;
  font-size: 2rem;
  font-family: ${fonts.headerFont};
  padding: 1.5rem 1rem;
  border-bottom: 2px black solid;
  width: 100%;
  @media(max-width: 1100px) {
    width: 120%;
  }
  @media(max-width: 700px) {
    width: 300%;
  }
 
  
  p {
   
    min-width: 5rem;
  }

`;
// const StyledTableHeader = styled(TableHeader)`
//   display: grid;
//   padding: 24px 15px;
//   border-bottom: 1px solid #e5e7eb;
//   font-size: 13px;
//   text-align: left;
// `;




const columns = [
  {
    name: "Pool",
    selector: "name",
  },
  {
    name: "Earning",
    selector: (data) => data.isActive.toString(),
    compact: true
    
  },
  {
    name: "Rewards",
    selector: "earnedRewards",
    compact: true,
    
    
  },
  {
    name: "Staked",
    selector: "stakedBalance",
    compact: true
    
    
  },
  {
    name: "% of Pool",
    selector: "percentOfPool",
    compact: true,
    
  },
  {
    name: "Unstaked",
    selector: "unstakedBalance",
    compact: true,
    
  },
  {
    name: "Value",
    selector: "usdValueOf",
    sortable: true,
    compact: true
  },
];





const FarmingTable = ({ state,setState }) => {

  const getThisReward= (reward) => {
      setState({...state,minimumHarvestAmount: reward})
      console.log(state.minimumHarvestAmount)
    
 }





  return (
      <ThemeProvider theme={state.theme === "dark" ? darkTheme : lightTheme}>
        
        {state.display ? 
        <TableContainer>
          {state.summaries.length === 0 ? <NotStaking state={state} />:
          <MainTableInner>
          <MainTableHeader>{columns.map(col => {
            return (
              <p>{col.name}</p>
            )
          })}</MainTableHeader>
          {state.summaries.map(utils.prettyPosition).map((summary, index) => (
          <MainTableRow key={summary.address}>
            <div>{summary.name}</div>
            <div className='active'>{String(summary.isActive)}</div>
            <div className='rewards' onClick={() =>getThisReward(summary.earnedRewards)}>{parseFloat(summary.earnedRewards).toFixed(10)}</div>
            <div>{parseFloat(summary.stakedBalance).toFixed(10)}</div>
            <div className='pool'>{summary.percentOfPool}</div>
            <div className='unstaked'>{parseFloat(summary.unstakedBalance).toFixed(10)}</div>
            <div className='value'>{summary.usdValueOf}</div>
            
          </MainTableRow>
        ))}
         
        </MainTableInner> }
        </TableContainer> 
        : <FarmTableSkeleton state={state} />}
          
    </ThemeProvider>
    
  );
};

export default FarmingTable;
