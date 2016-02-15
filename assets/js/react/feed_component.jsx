
var Feed_Component = React.createClass({
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
			<div className="container-fluid">
				<div className="row page-title">
					<div className="col-sm-12">
						<h1><b>TED</b><span>Talk</span> <small>Feed</small></h1>
					</div>
				</div>
				<div className="row">
					<div className="col-sm-6">
						<div className={'feed-items-container'}>
							<ul>
								{
									this.state.feed_items.length > 0 ?
									this.state.feed_items.map(function(val, index, arr){
										timeago = moment(val.publishedDate).fromNow();
										return <FeedItem title={val.title}
														 img={val.mediaGroups[0].contents[0].thumbnails[0].url}
														 published={timeago}
														 id={index}
														 fullView={_this.fullView}
														 key={index}
														 css={'feed-item clearfix'} /> ;
									}) :
									null
								}
							</ul>
						</div>
					</div>
					<div className="col-sm-6 full-view">
						<div className="view">
							{
								this.state.active_item ? 
								<ActiveItem title={this.state.active_item.title}
											thumbnail={this.state.active_item.mediaGroups[0].contents[0].thumbnails[0].url}
											videotype={this.state.active_item.mediaGroups[0].contents[0].type}
											video={this.state.active_item.mediaGroups[0].contents[0].url}
											link={this.state.active_item.link}
											posted={this.state.active_item.publishedDate}
											category={this.state.active_item.categories}
											descrip={this.state.active_item.content} />
								: <div>{'Select a talk to view more about it.'}</div>
							}
						</div>
					</div>
				</div>
			</div>
		);
	}
});

var ActiveItem = React.createClass({
	render: function(){
		var timeago = moment(this.props.posted).fromNow();
		var descrip = this.props.descrip.length > 300 ? this.props.descrip.substr(0, 300).concat('...') : this.props.descrip;
		return (
			<div className="active-item">
				<h3>{this.props.title}</h3>
				<div className="thumbnail-container">
					<a href={this.props.video} target="_blank">
						<img src={this.props.thumbnail} alt="thumbnail" />
					</a>
					<div className="play text-center"><b>Play</b></div>
				</div>
				<div className="descrip">
					{descrip}
				</div>
				<div>
					<small><b>Posted: {timeago}</b></small>
				</div>
				<div>
					<small>Category: {this.props.category}</small>
				</div>
			</div>
		);
	}
});

var FeedItem = React.createClass({
	makeActive: function(e){
		e.preventDefault();
		var elem = $(e.currentTarget).closest('.feed-item');
		$('.feed-item').css('border', 'none');
		elem.css('border', '3px solid red');
		this.props.fullView(elem);
	},

	render: function(){
		return(
			<li className={this.props.css} data-id={this.props.id}>
				<img className="thumb" src={this.props.img} />
				<div className="content">
					<a href="" onClick={this.makeActive}>
						<div className="title">{this.props.title}</div>
						<div className="timeago"><small>Posted: {this.props.published}</small></div>
					</a>
				</div>
			</li>
		);
	}
});

ReactDOM.render( <Feed_Component />, document.getElementById('feed-container') );