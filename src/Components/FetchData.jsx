import axios from "axios";
import React, { useEffect, useState } from "react";
import TableBox from "./TableBox";

const FetchData = () => {
  const [data, setData] = useState(null);
  const [search, setSearch] = useState("");

  async function fetchData() {
    try {
      axios
        .get(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
        )
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error("ERR: " + error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  function searchFilter(data, search) {
    return data.filter((coin) => {
      return (
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())
      );
    });
  }

  function sortDataByMktCap() {
    return setData([...data].sort((a, b) => b.market_cap - a.market_cap));
  }

  function sortDataByPercentage() {
    return setData(
      [...data].sort(
        (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
      )
    );
  }

  useEffect(() => {
    if (search) {
      const filteredData = searchFilter(data, search);
      setData(filteredData);
    } else {
      fetchData();
    }
  }, [search]);

  return (
    <div className="app">
      <div className="flex w-4/6 justify-center items-center p-5 gap-2">
        <input
          value={search}
          onChange={(e) => {
            return setSearch(e.target.value);
          }}
          type="text"
          placeholder="Search By Name or Symbol "
          className="border w-3/4 px-3 py-2 border-white bg-transparent"
        />
        <button
          onClick={sortDataByMktCap}
          className="border py-2 w-1/5 px-3 border-white bg-transparent"
        >
          Sort By Mkt Cap
        </button>
        <button
          onClick={sortDataByPercentage}
          className="border py-2 w-1/5 px-3 border-white bg-transparent"
        >
          Sort by percentage
        </button>
      </div>
      <div className="app-sub">
        {data > 0 ? (
          <table>
            <tbody>
              {console.log(data)}
              {data.map((coin) => {
                return <TableBox data={coin} key={coin.id} />;
              })}
            </tbody>
          </table>
        ) : (
          <div className="load" id="load">
            <p className="loader"></p>
            <p className="loading">Loading</p>
            {document.getElementById("load") &&
              setTimeout(() => {
                document.getElementById("load").innerHTML =
                  "Error loading data Refresh the page. or try again later.";
              }, 5000)}
          </div>
        )}
      </div>
    </div>
  );
};

export default FetchData;
