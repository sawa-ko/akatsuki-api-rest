'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">backend-api documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AdminModule.html" data-type="entity-link">AdminModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AdminModule-1cca0f8aea17cbedff03cb12119b76ab"' : 'data-target="#xs-controllers-links-module-AdminModule-1cca0f8aea17cbedff03cb12119b76ab"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AdminModule-1cca0f8aea17cbedff03cb12119b76ab"' :
                                            'id="xs-controllers-links-module-AdminModule-1cca0f8aea17cbedff03cb12119b76ab"' }>
                                            <li class="link">
                                                <a href="controllers/AdminController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AdminController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AdminModule-1cca0f8aea17cbedff03cb12119b76ab"' : 'data-target="#xs-injectables-links-module-AdminModule-1cca0f8aea17cbedff03cb12119b76ab"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AdminModule-1cca0f8aea17cbedff03cb12119b76ab"' :
                                        'id="xs-injectables-links-module-AdminModule-1cca0f8aea17cbedff03cb12119b76ab"' }>
                                        <li class="link">
                                            <a href="injectables/AdminService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AdminService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AppModule-77293113bad37a6218de298875598b94"' : 'data-target="#xs-controllers-links-module-AppModule-77293113bad37a6218de298875598b94"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-77293113bad37a6218de298875598b94"' :
                                            'id="xs-controllers-links-module-AppModule-77293113bad37a6218de298875598b94"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-77293113bad37a6218de298875598b94"' : 'data-target="#xs-injectables-links-module-AppModule-77293113bad37a6218de298875598b94"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-77293113bad37a6218de298875598b94"' :
                                        'id="xs-injectables-links-module-AppModule-77293113bad37a6218de298875598b94"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link">AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AuthModule-0fce9bb641f4395d4f77078d3b0fe07d"' : 'data-target="#xs-controllers-links-module-AuthModule-0fce9bb641f4395d4f77078d3b0fe07d"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-0fce9bb641f4395d4f77078d3b0fe07d"' :
                                            'id="xs-controllers-links-module-AuthModule-0fce9bb641f4395d4f77078d3b0fe07d"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AuthModule-0fce9bb641f4395d4f77078d3b0fe07d"' : 'data-target="#xs-injectables-links-module-AuthModule-0fce9bb641f4395d4f77078d3b0fe07d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-0fce9bb641f4395d4f77078d3b0fe07d"' :
                                        'id="xs-injectables-links-module-AuthModule-0fce9bb641f4395d4f77078d3b0fe07d"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>JwtStrategy</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ConfigModule.html" data-type="entity-link">ConfigModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MarketModule.html" data-type="entity-link">MarketModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-MarketModule-2470a37590e32679ffba405ba8c66728"' : 'data-target="#xs-controllers-links-module-MarketModule-2470a37590e32679ffba405ba8c66728"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-MarketModule-2470a37590e32679ffba405ba8c66728"' :
                                            'id="xs-controllers-links-module-MarketModule-2470a37590e32679ffba405ba8c66728"' }>
                                            <li class="link">
                                                <a href="controllers/MarketController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MarketController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-MarketModule-2470a37590e32679ffba405ba8c66728"' : 'data-target="#xs-injectables-links-module-MarketModule-2470a37590e32679ffba405ba8c66728"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-MarketModule-2470a37590e32679ffba405ba8c66728"' :
                                        'id="xs-injectables-links-module-MarketModule-2470a37590e32679ffba405ba8c66728"' }>
                                        <li class="link">
                                            <a href="injectables/MarketService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>MarketService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TransactionModule.html" data-type="entity-link">TransactionModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-TransactionModule-cf75c197bce751696861d304f2134a54"' : 'data-target="#xs-controllers-links-module-TransactionModule-cf75c197bce751696861d304f2134a54"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-TransactionModule-cf75c197bce751696861d304f2134a54"' :
                                            'id="xs-controllers-links-module-TransactionModule-cf75c197bce751696861d304f2134a54"' }>
                                            <li class="link">
                                                <a href="controllers/TransactionController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TransactionController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-TransactionModule-cf75c197bce751696861d304f2134a54"' : 'data-target="#xs-injectables-links-module-TransactionModule-cf75c197bce751696861d304f2134a54"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TransactionModule-cf75c197bce751696861d304f2134a54"' :
                                        'id="xs-injectables-links-module-TransactionModule-cf75c197bce751696861d304f2134a54"' }>
                                        <li class="link">
                                            <a href="injectables/TransactionService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>TransactionService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link">UserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-UserModule-d158013b9fba3defcb8d3f738a973b9b"' : 'data-target="#xs-controllers-links-module-UserModule-d158013b9fba3defcb8d3f738a973b9b"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserModule-d158013b9fba3defcb8d3f738a973b9b"' :
                                            'id="xs-controllers-links-module-UserModule-d158013b9fba3defcb8d3f738a973b9b"' }>
                                            <li class="link">
                                                <a href="controllers/UserController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UserController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UserModule-d158013b9fba3defcb8d3f738a973b9b"' : 'data-target="#xs-injectables-links-module-UserModule-d158013b9fba3defcb8d3f738a973b9b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-d158013b9fba3defcb8d3f738a973b9b"' :
                                        'id="xs-injectables-links-module-UserModule-d158013b9fba3defcb8d3f738a973b9b"' }>
                                        <li class="link">
                                            <a href="injectables/UserService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#controllers-links"' :
                                'data-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AdminController.html" data-type="entity-link">AdminController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AppController.html" data-type="entity-link">AppController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AuthController.html" data-type="entity-link">AuthController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/MarketController.html" data-type="entity-link">MarketController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/TransactionController.html" data-type="entity-link">TransactionController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/UserController.html" data-type="entity-link">UserController</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/BuyerAddMarketDto.html" data-type="entity-link">BuyerAddMarketDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/BuyerMarket.html" data-type="entity-link">BuyerMarket</a>
                            </li>
                            <li class="link">
                                <a href="classes/BuyerRemoveMarketDto.html" data-type="entity-link">BuyerRemoveMarketDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ChangelogAuthor.html" data-type="entity-link">ChangelogAuthor</a>
                            </li>
                            <li class="link">
                                <a href="classes/ChangelogModel.html" data-type="entity-link">ChangelogModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/CommentMarket.html" data-type="entity-link">CommentMarket</a>
                            </li>
                            <li class="link">
                                <a href="classes/CommentMarketDto.html" data-type="entity-link">CommentMarketDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CommentRemoveMarketDto.html" data-type="entity-link">CommentRemoveMarketDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConfigService.html" data-type="entity-link">ConfigService</a>
                            </li>
                            <li class="link">
                                <a href="classes/DiscountMarket.html" data-type="entity-link">DiscountMarket</a>
                            </li>
                            <li class="link">
                                <a href="classes/Email.html" data-type="entity-link">Email</a>
                            </li>
                            <li class="link">
                                <a href="classes/Email-1.html" data-type="entity-link">Email</a>
                            </li>
                            <li class="link">
                                <a href="classes/GeneralGateway.html" data-type="entity-link">GeneralGateway</a>
                            </li>
                            <li class="link">
                                <a href="classes/Market.html" data-type="entity-link">Market</a>
                            </li>
                            <li class="link">
                                <a href="classes/MarketModel.html" data-type="entity-link">MarketModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/Membership.html" data-type="entity-link">Membership</a>
                            </li>
                            <li class="link">
                                <a href="classes/Membership-1.html" data-type="entity-link">Membership</a>
                            </li>
                            <li class="link">
                                <a href="classes/Notifications.html" data-type="entity-link">Notifications</a>
                            </li>
                            <li class="link">
                                <a href="classes/Notifications-1.html" data-type="entity-link">Notifications</a>
                            </li>
                            <li class="link">
                                <a href="classes/Online.html" data-type="entity-link">Online</a>
                            </li>
                            <li class="link">
                                <a href="classes/Online-1.html" data-type="entity-link">Online</a>
                            </li>
                            <li class="link">
                                <a href="classes/Password.html" data-type="entity-link">Password</a>
                            </li>
                            <li class="link">
                                <a href="classes/Password-1.html" data-type="entity-link">Password</a>
                            </li>
                            <li class="link">
                                <a href="classes/Rank.html" data-type="entity-link">Rank</a>
                            </li>
                            <li class="link">
                                <a href="classes/Rank-1.html" data-type="entity-link">Rank</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReactionAddMarketDto.html" data-type="entity-link">ReactionAddMarketDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReactionRemoveMarketDto.html" data-type="entity-link">ReactionRemoveMarketDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Reactions.html" data-type="entity-link">Reactions</a>
                            </li>
                            <li class="link">
                                <a href="classes/Reactions-1.html" data-type="entity-link">Reactions</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReactionsDto.html" data-type="entity-link">ReactionsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReactionsMarket.html" data-type="entity-link">ReactionsMarket</a>
                            </li>
                            <li class="link">
                                <a href="classes/Security.html" data-type="entity-link">Security</a>
                            </li>
                            <li class="link">
                                <a href="classes/Security-1.html" data-type="entity-link">Security</a>
                            </li>
                            <li class="link">
                                <a href="classes/SecurityCode.html" data-type="entity-link">SecurityCode</a>
                            </li>
                            <li class="link">
                                <a href="classes/SecurityDto.html" data-type="entity-link">SecurityDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SecurityUpdateDto.html" data-type="entity-link">SecurityUpdateDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Sessions.html" data-type="entity-link">Sessions</a>
                            </li>
                            <li class="link">
                                <a href="classes/Sessions-1.html" data-type="entity-link">Sessions</a>
                            </li>
                            <li class="link">
                                <a href="classes/SignInDto.html" data-type="entity-link">SignInDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Stats.html" data-type="entity-link">Stats</a>
                            </li>
                            <li class="link">
                                <a href="classes/Stats-1.html" data-type="entity-link">Stats</a>
                            </li>
                            <li class="link">
                                <a href="classes/Suspension.html" data-type="entity-link">Suspension</a>
                            </li>
                            <li class="link">
                                <a href="classes/Suspension-1.html" data-type="entity-link">Suspension</a>
                            </li>
                            <li class="link">
                                <a href="classes/Transaction.html" data-type="entity-link">Transaction</a>
                            </li>
                            <li class="link">
                                <a href="classes/Transaction-1.html" data-type="entity-link">Transaction</a>
                            </li>
                            <li class="link">
                                <a href="classes/TransactionBuyer.html" data-type="entity-link">TransactionBuyer</a>
                            </li>
                            <li class="link">
                                <a href="classes/TransactionBuyer-1.html" data-type="entity-link">TransactionBuyer</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserDto.html" data-type="entity-link">UpdateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserDto.html" data-type="entity-link">UserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserModel.html" data-type="entity-link">UserModel</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AdminService.html" data-type="entity-link">AdminService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AppService.html" data-type="entity-link">AppService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link">AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtStrategy.html" data-type="entity-link">JwtStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MarketService.html" data-type="entity-link">MarketService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TransactionService.html" data-type="entity-link">TransactionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link">UserService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/RankGuard.html" data-type="entity-link">RankGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/IJwtPayload.html" data-type="entity-link">IJwtPayload</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});