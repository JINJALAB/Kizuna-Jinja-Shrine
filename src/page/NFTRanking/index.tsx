import { getUserPrayRankRes } from "api/request";
import moment from "moment";
import { useEffect, useCallback, useState } from "react";
import "./index.css";

const monthTabs = [
  { value: "12", label: "December" },
  {
    value: "11",
    label: "November",
  },
  {
    value: "10",
    label: "October",
  },
  {
    value: "09",
    label: "September",
  },
  {
    value: "08",
    label: "August",
  },
  {
    value: "07",
    label: "July",
  },
  {
    value: "06",
    label: "June",
  },
  {
    value: "05",
    label: "May",
  },
  {
    value: "04",
    label: "April",
  },
  {
    value: "03",
    label: "March",
  },
  {
    value: "02",
    label: "February",
  },
  {
    value: "01",
    label: "January",
  },
];

const initLast3Months = () => {
  const m1 = moment(),
    m2 = moment().add(-1, "M"),
    m3 = moment().add(-2, "M");

  return [
    {
      key: m1.format("YYYY-MM"),
      en: monthTabs.find((x) => x.value === m1.format("MM"))?.label,
    },
    {
      key: m2.format("YYYY-MM"),
      en: monthTabs.find((x) => x.value === m2.format("MM"))?.label,
    },
    {
      key: m3.format("YYYY-MM"),
      en: monthTabs.find((x) => x.value === m3.format("MM"))?.label,
    },
  ];
};

const last3Months = initLast3Months();

export function NFTRanking() {
  const [monthTabIndex, setMonthTabIndex] = useState(0);
  const [rankings, setRankings] = useState([]);

  const onTabClick = useCallback((e: any) => {
    const index = e.target.getAttribute("data-index");
    setMonthTabIndex(Number(index));
  }, []);

  const getUserPrayRank = useCallback(async () => {
    const result: any = await getUserPrayRankRes(
      last3Months[monthTabIndex].key
    );
    setRankings(result.data.data.list);
  }, [monthTabIndex]);

  useEffect(() => {
    getUserPrayRank();
  }, [monthTabIndex, getUserPrayRank]);

  return (
    <div className="ranking-wrap">
      <div className="title">JINJA LAB</div>
      <div className="ranking-content">
        <div className="ranking-content-inner">
          {rankings.map((x: any, i) => (
            <div className="ranking-layer" key={i}>
              <img src={x.imageUrl} alt="" />
              <div className="pary-details">
                <p className="username">
                  {x.tokenName} # {x.tokenId}
                </p>
                <div className="value-time">
                  <p>{`{ ${x.userName ? x.userName : "-"} }`}</p>
                  <p>{`{ ${x.createTime} }`}</p>
                  <p>{`{ ${x.prayValue} }`}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="tab-wrap" onClick={onTabClick}>
          {last3Months.map((x, i) => {
            return (
              <div
                className={`tab-item ${monthTabIndex === i ? "active" : ""}`}
                data-index={i}
                key={i}
              >
                <span data-index={i}>{x.en}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
