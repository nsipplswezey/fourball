var Comment = React.createClass({
  render: function() {
    return (
      <div className="comment">
      <h2 className="commentAuthor">
      {this.props.author}
      </h2>
      {this.props.children}
      </div>
    );
  }
});


var CommentList = React.createClass({
  render: function(){
    var commentNodes = this.props.data.map(function(comment){
      return (
        <Comment author={comment.author}>
        {comment.text}
        </Comment>
      )

    })
    return (
      <div className="commentList">
      {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  handleSubmit: function(e){
    e.preventDefault();
    var author = this.refs.author.getDOMNode().value.trim();
    var text = this.refs.text.getDOMNode().value.trim();

    if (!text ||  !author) {
      return;
    }
    console.log("handleSubmit Called");
    this.props.onCommentSubmit({author: author, text: text});
    this.refs.author.getDOMNode().value = '';
    this.refs.text.getDOMNode().value = '';
  },

  render: function(){
    return(
      <form className="commentForm" onSubmit={this.handleSubmit}>
      <input type="text" placeholder="Your name" ref="author"/>
      <input type="text" placeholder="Say something..." ref="text"/>
      <input type="submit" value="Post" />
      </form>

    );
  }
});

var CommentBox = React.createClass({

  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data){
        this.setState({data: data});
      }.bind(this), //why bind this?
      //Must be a react thing to set the context of the call back
      error: function(xhr, status, err){
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },


  handleCommentSubmit: function(comment){
    //before the ajax request
    //lets just render the comment
    var comments = this.state.data;
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});

    //the ajax request is still made
    //So that this gets posted to the database
    console.log("submitted");
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data){
        this.setState({data: data})
      }.bind(this),
      error: function(xhr, status, err){
        console.error(this.props.url, status, err.toString())
      }.bind(this)
    });
  },

  getInitialState: function(){
    return {data: []}
  },

  componentDidMount: function(){
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval)
  },

  render: function(){
    return(
      <div className="commentBox">
      <h1>Comments</h1>
      <CommentList data={this.state.data}/>
      <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});