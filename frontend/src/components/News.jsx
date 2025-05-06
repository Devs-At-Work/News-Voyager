import React, {useEffect, useState} from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";
import NavBar from './NavBar';
import { useUser } from './UserContext'; 

const News = (props)=>{
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalResults, setTotalResults] = useState(0)
    const { userEmail } = useUser();
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    } 

    const updateNews = async (userEmail) => {
        props.setProgress(10);
        // Use path-based routing with the ALB
        let expressUrl = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`; 
        
        if(props.category == 'business'){ 
            expressUrl = `/business/news/${props.category}?page=${page + 1}&pageSize=${props.pageSize}&country=${props.country}`;
        }
        else if(props.category == 'enterainment'){
          expressUrl = `/entertainment/news/${props.category}?page=${page + 1}&pageSize=${props.pageSize}&country=${props.country}`;
        }
        else if(props.category == 'general'){
          expressUrl = `/general/news/${props.category}?page=${page + 1}&pageSize=${props.pageSize}&country=${props.country}`;
        }
        else if(props.category == 'health'){
          expressUrl = `/health/news/${props.category}?page=${page + 1}&pageSize=${props.pageSize}&country=${props.country}`;
        }
        else if(props.category == 'science'){
          expressUrl = `/science/news/${props.category}?page=${page + 1}&pageSize=${props.pageSize}&country=${props.country}`;
        }
        else if(props.category == 'sports'){
          expressUrl = `/sports/news/${props.category}?page=${page + 1}&pageSize=${props.pageSize}&country=${props.country}`;
        }
        else if(props.category == 'technology'){
          expressUrl = `/technology/news/${props.category}?page=${page + 1}&pageSize=${props.pageSize}&country=${props.country}`;
        }
        else if(props.category == 'newsForYou'){
          console.log(userEmail)
          expressUrl = `/feed/news/${props.category}?userEmail=${userEmail}`;
        }
        
        setLoading(true);
      
        try {
          let response = await fetch(expressUrl);
      
          if (response.ok) {
            props.setProgress(30);
            let parsedData = await response.json();
            props.setProgress(70);
            setArticles(parsedData.articles);
            setTotalResults(parsedData.totalResults);
            props.setProgress(100);
          } else {
            throw new Error('Failed to fetch news');
          }
        } catch (error) {
          console.error('Error fetching news:', error.message);
        } finally {
          setLoading(false);
        }
    };

    useEffect(() => {
        document.title = `NewsVoyager - ${capitalizeFirstLetter(props.category)}`;
        updateNews(userEmail); 
    }, [userEmail])

    const fetchMoreData = async () => {
        let expressUrl = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`; 
        
        if(props.category == 'business'){
            expressUrl = `/business/news/${props.category}?page=${page + 1}&pageSize=${props.pageSize}&country=${props.country}`;
        }
        else if(props.category == 'enterainment'){
          expressUrl = `/entertainment/news/${props.category}?page=${page + 1}&pageSize=${props.pageSize}&country=${props.country}`;
        }
        else if(props.category == 'general'){
          expressUrl = `/general/news/${props.category}?page=${page + 1}&pageSize=${props.pageSize}&country=${props.country}`;
        }
        else if(props.category == 'health'){
          expressUrl = `/health/news/${props.category}?page=${page + 1}&pageSize=${props.pageSize}&country=${props.country}`;
        }
        else if(props.category == 'science'){
          expressUrl = `/science/news/${props.category}?page=${page + 1}&pageSize=${props.pageSize}&country=${props.country}`;
        }
        else if(props.category == 'sports'){
          expressUrl = `/sports/news/${props.category}?page=${page + 1}&pageSize=${props.pageSize}&country=${props.country}`;
        }
        else if(props.category == 'technology'){
          expressUrl = `/technology/news/${props.category}?page=${page + 1}&pageSize=${props.pageSize}&country=${props.country}`;
        }
        else if(props.category == 'newsForYou'){
          expressUrl = `/feed/news/${props.category}?userEmail=${userEmail}`;
        }
        
        setPage(page + 1);
      
        try {
          const response = await fetch(expressUrl);
          
          if (response.ok) {
            const parsedData = await response.json();
            setArticles(articles.concat(parsedData.articles));
            setTotalResults(parsedData.totalResults);
          } else {
            throw new Error('Failed to fetch more data');
          }
        } catch (error) {
          console.error('Error fetching more data:', error.message);
        }
    };
      
    // Rest of component remains the same
    return (
      <>
        <NavBar/>
          <h1 className="text-center" style={{ margin: '35px 0px', marginTop: '90px' }}>NewsVoyager - Top {capitalizeFirstLetter(props.category)} Headlines.</h1>
          {loading && <Spinner />}
          <InfiniteScroll
              dataLength={articles.length}
              next={fetchMoreData}
              hasMore={articles.length !== totalResults}
              loader={<Spinner/>}
          > 
              <div className="container">
                   
              <div className="row">
                  {articles.map((element) => {
                      return <div className="col-md-4" key={element.url}>
                          <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                      </div>
                  })}
              </div>
              </div> 
          </InfiniteScroll> 
      </>
  )
}


News.defaultProps = {
  country: 'in',
  pageSize: 8,
  category: 'general',
}

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
}

export default News