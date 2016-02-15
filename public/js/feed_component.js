
var Feed_Component = React.createClass({displayName: "Feed_Component",
	getInitialState: function(){
		return {
			feed_items: [],
			active_item: null
		};
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
		var item_index = parseInt(elem.data('id'));
		var feed_copy = this.state.feed_items.slice();
		this.setState({active_item: feed_copy[item_index]});
	},

	render: function(){
		var timeago = null, _this = this;
		return (
			React.createElement("div", {className: "container-fluid"}, 
				React.createElement("div", {className: "row page-title"}, 
					React.createElement("div", {className: "col-sm-12"}, 
						React.createElement("h1", null, React.createElement("b", null, "TED"), React.createElement("span", null, "Talk"), " ", React.createElement("small", null, "Feed"))
					)
				), 
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
									null
								
							)
						)
					), 
					React.createElement("div", {className: "col-sm-6 full-view"}, 
						React.createElement("div", {className: "view"}, 
							
								this.state.active_item ? 
								React.createElement(ActiveItem, {title: this.state.active_item.title, 
											thumbnail: this.state.active_item.mediaGroups[0].contents[0].thumbnails[0].url, 
											videotype: this.state.active_item.mediaGroups[0].contents[0].type, 
											video: this.state.active_item.mediaGroups[0].contents[0].url, 
											link: this.state.active_item.link, 
											posted: this.state.active_item.publishedDate, 
											category: this.state.active_item.categories, 
											descrip: this.state.active_item.content})
								: React.createElement("div", null, 'Select a talk to view more about it.')
							
						)
					)
				)
			)
		);
	}
});

var ActiveItem = React.createClass({displayName: "ActiveItem",
	render: function(){
		var timeago = moment(this.props.posted).fromNow();
		var descrip = this.props.descrip.length > 300 ? this.props.descrip.substr(0, 300).concat('...') : this.props.descrip;
		return (
			React.createElement("div", {className: "active-item"}, 
				React.createElement("h3", null, this.props.title), 
				React.createElement("div", {className: "thumbnail-container"}, 
					React.createElement("a", {href: this.props.video, target: "_blank"}, 
						React.createElement("img", {src: this.props.thumbnail, alt: "thumbnail"})
					), 
					React.createElement("div", {className: "play text-center"}, React.createElement("b", null, "Play"))
				), 
				React.createElement("div", {className: "descrip"}, 
					descrip
				), 
				React.createElement("div", null, 
					React.createElement("small", null, React.createElement("b", null, "Posted: ", timeago))
				), 
				React.createElement("div", null, 
					React.createElement("small", null, "Category: ", this.props.category)
				)
			)
		);
	}
});

var FeedItem = React.createClass({displayName: "FeedItem",
	makeActive: function(e){
		e.preventDefault();
		var elem = $(e.currentTarget).closest('.feed-item');
		$('.feed-item').css('border', 'none');
		elem.css('border', '3px solid red');
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