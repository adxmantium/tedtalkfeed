
var Feed_Component = React.createClass({
	getInitialState: function(){
		return {
			feed_items: []
		};
	},

	componentWillMount: function(){
		
	},

	componentDidMount: function(){
		google.load("feeds", "1");
		var entry, arr_copy = this.state.feed_items.slice(), _this = this;

	    function initialize() {
	    	//google feed api
	      	var feed = new google.feeds.Feed("http://feeds.feedburner.com/tedtalks_video");
	      	feed.setNumEntries(10);
	      	feed.load(function(result) {
		        if (!result.error) {
					for (var i = 0; i < result.feed.entries.length; i++) {
						entry = result.feed.entries[i];
						//add each entry to copy of current state of feed_items array
						arr_copy.push(entry);
						console.log(arr_copy);
					}
					//render state once feed is done being added to array
					_this.setState({feed_items: arr_copy});
		        }
	      	});
	    }

	    google.setOnLoadCallback(initialize);
	},

	render: function(){
		var timeago = null;
		return (
			<div className={'feed-items-container'}>
				<ul>
					{
						this.state.feed_items.length > 0 ?
						this.state.feed_items.map(function(val, index, arr){
							console.log(val);
							timeago = moment(val.publishedDate).fromNow();
							return <FeedItem title={val.title}
											 img={val.mediaGroups[0].contents[0].thumbnails[0].url}
											 published={timeago}
											 css={'feed-item clearfix'} /> ;
						}) :
						<li>nothing</li>
					}
				</ul>
			</div>
		);
	}
});

var FeedItem = React.createClass({
	render: function(){
		return(
			<li className={this.props.css}>
				<img className="thumb" src={this.props.img} />
				<div className="content">
					<div className="title">{this.props.title}</div>
					<div className="timeago"><small>Posted: {this.props.published}</small></div>
				</div>
			</li>
		);
	}
});

ReactDOM.render( <Feed_Component />, document.getElementById('feed-container') );