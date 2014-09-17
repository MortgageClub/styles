#Introduction
## Trulia Experience Language

Trulia now has our very own custom library which make building new pages and features awesome. These OOCSS components (Legos) will make things easy and repeatable. For added fun, say OooOooCSS instead of O-O-CSS.

<i class="iconStar"></i> **Layout** - Like a Lego starter set. We lay down the base and you fill in the rest. Used to position things in neat little lines and columns. [Template](layout.html#Template), [Grids](layout.html#Grids)

<i class="iconStar"></i> **Base CSS** - The basics. And no, it's not just Buttons. 
[Background Colors](base_css.html#Background Colors), [Buttons](base_css.html#Buttons), [Dividers](base_css.html#Dividers), [<i class="iconRocket"></i>Icons](base_css.html#Icons),  [Link](base_css.html#Link), [Lists](base_css.html#Lists), [Tables](base_css.html#Tables), & [Typography](base_css.html#Typography)

<i class="iconStar"></i> **Components** - UI elements which make our experience sing. The bulk of the library is here for more complex pages.
[Ads](components.html#Ads), [Add Ons](components.html#Add Ons), [Alerts](components.html#Alerts), [Badges](components.html#Badges), [Boxes](components.html#Boxes), [Box Actions](components.html#Box Actions), [Box Footer](components.html#Box Footer), [Box Header](components.html#Box Header), [Button Groups](components.html#Button Groups), [Frames](components.html#Frames), [Hover](components.html#Hover), [Image Container](components.html#Image Container), [Media](components.html#Media), [Inline Media Block](components.html#Inline Media Block), [Menu](components.html#Menu), [Overlay](components.html#Overlay), & [Search Bar](components.html#Search Bar)

<i class="iconStar"></i> **Forms** – There are so numerous they needed their own page! FORMICATION.
[Forms](forms.html)

<i class="iconStar"></i> **Javascript** - Components with a bit o' Javascript to them.
[Dropdowns](javascript.html#Dropdowns), [Modal Box](javascript.html#Modal Box), [Navigation](javascript.html#Navigation), [Rating](javascript.html#Rating), [Sticky](javascript.html#Sticky), [Tabs](javascript.html#Tabs), [Toggle](javascript.html#Toggle), & [Tooltips](javascript.html#Tooltips)

<i class="iconStar"></i> **Utilities** - Helpers which augment other components. Like the Supports in your party.
[Clickable](utilities.html#Clickable), [Hide Things](utilities.html#Hide Things), [Text Alignment](utilities.html#Text Alignment), & [Whitespace](utilities.html#Whitespace)

<br/>
# Getting Started
You don't need to do much to start using this library. In the `css/combo-minify.ini` in the web repository there is a package called `lib_oocss`. Include this on your page and you're ready to go.  

<br />
# Documentation
If you just wanna build with web Legos, you're all ready to go! <br/>
(And the nice thing is, you can't step on web Legos.)

For the curious possible contributors, check out our [full library documentation](http://knowledge.corp.trulia.com/display/Engineering/Developer+and+Designer+Guide+to+TXL).

<br/>

# OOCSS Philosophy

### Thou shall not invent new components
<strike>It really means no worries for the rest of your days…</strike> It really means if you can build a higher level component using existing ones (Homepage Search Box out of a Highlighted Box w/ Forms inside of it), don't remake it! But if you need a control we haven't accounted for yet, please bring it up with an idea of where it may be used in the product. A good rule of thumb is if we foresee an element being used **multiple** times, it should be in the library. We may also drop elements and styles we never actually use to slim down our footprint.

<br/>
#### Daft Punk
<i class="iconStar"></i> **Better** Less overhead  
<i class="iconStar"></i> **Faster** Components built & tested  
<i class="iconStar"></i> **Stronger** Cohesive products


<br/>

# FAQs  

#####**I'm adding a feature to an existing page, can I use OOCSS for that?**

No. The bad news is that the library does not play nicely with all of our existing CSS. Because of this we have decided to use the library only to rebuild new pages from scratch. (And now you have a good reason to ask for a proper revisit of a whole product. Teams which build with OOCSS are about 10,000% happier, :)

<br/>

#####**I have a design that has components that aren't in the library, how do I add them?**

When this situation comes up the developer and designer working on a project should meet up and discuss whether there are other options for building the feature using existing components. So far our experience has shown that in most cases we can accomplish what we want by modfying our design to fit the constraints of the library. This has ultimately lead to both better design and less code.

Of course, that won't always be the case. The library is going to be an ever changing entity with components being added, dropped, or modified. If you want to add a new component to the library first check out the following guides:

<i class="iconStar"></i> <a href="#">How to Write OOCSS</a>

<i class="iconStar"></i> <a href="#">Sass and OOCSS Best Practices</a>

<i class="iconStar"></i> <a href="#">OOCSS Review Process</a>

<br/>

#####**Who should I talk to about Trulia OOCSS?**
Trulia OOCSS has a core group of maintainers and many contributors. You can send general questions to <a href="mailto:oocss@trulia.com">oocss@trulia.com</a> or come bug the following folks. We are happy to teach you the ways.

<i class="iconStar"></i> JD Cantrell

<i class="iconStar"></i> Vince Lum <span class="typeLowlight">v1</span>

<i class="iconStar"></i> Nikki Perry

<i class="iconStar"></i> Sean Stopnik

#####**Contributors Emiritus**

<i class="iconStar"></i> August Flanagan

<i class="iconStar"></i> Susan Lin

