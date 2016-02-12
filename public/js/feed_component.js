
var Feed_Component = React.createClass({displayName: "Feed_Component",
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
			React.createElement("div", {className: 'feed-items-container'}, 
				React.createElement("ul", null, 
					
						this.state.feed_items.length > 0 ?
						this.state.feed_items.map(function(val, index, arr){
							console.log(val);
							timeago = moment(val.publishedDate).fromNow();
							return React.createElement(FeedItem, {title: val.title, 
											 img: val.mediaGroups[0].contents[0].thumbnails[0].url, 
											 published: timeago, 
											 css: 'feed-item clearfix'}) ;
						}) :
						React.createElement("li", null, "nothing")
					
				)
			)
		);
	}
});

var FeedItem = React.createClass({displayName: "FeedItem",
	render: function(){
		return(
			React.createElement("li", {className: this.props.css}, 
				React.createElement("img", {className: "thumb", src: this.props.img}), 
				React.createElement("div", {className: "content"}, 
					React.createElement("div", {className: "title"}, this.props.title), 
					React.createElement("div", {className: "timeago"}, React.createElement("small", null, "Posted: ", this.props.published))
				)
			)
		);
	}
});

ReactDOM.render( React.createElement(Feed_Component, null), document.getElementById('feed-container') );