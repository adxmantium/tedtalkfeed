
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
	      	feed.setNumEntries(20);
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

	fullView: function(elem){
		elem.css('border', '3px solid red');
		var data = elem.data('id');
		console.log(data)
	},

	render: function(){
		var timeago = null, _this = this;
		return (
			React.createElement("div", {className: "container-fluid"}, 
				React.createElement("div", {className: "row"}, 
					React.createElement("div", {className: "col-sm-6"}, 
						React.createElement("div", {className: 'feed-items-container'}, 
							React.createElement("ul", null, 
								
									this.state.feed_items.length > 0 ?
									this.state.feed_items.map(function(val, index, arr){
										timeago = moment(val.publishedDate).fromNow();
										return React.createElement(FeedItem, {title: val.title, 
														 img: val.mediaGroups[0].contents[0].thumbnails[0].url, 
														 published: timeago, 
														 id: index, 
														 fullView: _this.fullView, 
														 key: index, 
														 css: 'feed-item clearfix'}) ;
									}) :
									React.createElement("li", null)
								
							)
						)
					), 
					React.createElement("div", {className: "col-sm-6 full-view"}, 
						React.createElement("h3", {className: "text-center"}, React.createElement("b", null, "TED"), React.createElement("span", null, "Talk"), " ", React.createElement("small", null, "Feed")), 
						React.createElement("div", {className: "view"}, 
							"view here"
						)
					)
				)
			)
		);
	}
});

var FeedItem = React.createClass({displayName: "FeedItem",
	makeActive: function(e){
		e.preventDefault();
		var elem = $(e.currentTarget).closest('.feed-item');
		console.log(elem);
		this.props.fullView(elem);
	},

	render: function(){
		return(
			React.createElement("li", {className: this.props.css, "data-id": this.props.id}, 
				React.createElement("img", {className: "thumb", src: this.props.img}), 
				React.createElement("div", {className: "content"}, 
					React.createElement("a", {href: "", onClick: this.makeActive}, 
						React.createElement("div", {className: "title"}, this.props.title), 
						React.createElement("div", {className: "timeago"}, React.createElement("small", null, "Posted: ", this.props.published))
					)
				)
			)
		);
	}
});

ReactDOM.render( React.createElement(Feed_Component, null), document.getElementById('feed-container') );