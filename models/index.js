var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack');

var Page = db.define('page', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    urlTitle: {
        type: Sequelize.STRING, 
        allowNull: false
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM('open', 'closed')
    },
    date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
},
    {
    getterMethods: {
    	route: function(){
    		console.log("Test url", this.urlTitle);
    		return '/wiki/' + this.urlTitle;
    	}
    // 	urlTitle: function() 
   	},
   	hooks: {
   		beforeValidate: function generateUrlTitle (myPage) {
			  console.log('title', myPage);
			  if (myPage.title) {
			    // Removes all non-alphanumeric characters from title
			    // And make whitespace underscore
			    myPage.urlTitle = myPage.title.replace(/\s+/g, '_').replace(/\W/g, '');
			  } else {
			    // Generates random 5 letter string
			    myPage.urlTitle = Math.random().toString(36).substring(2, 7);
		 	  }
		    }
   	    }
    }
);

var User = db.define('user', {
    name: {
        type: Sequelize.STRING, 
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        isEmail: true,
        allowNull: false
    }
});

Page.belongsTo(User, {as: 'author'});

module.exports = {
  Page: Page,
  User: User
};