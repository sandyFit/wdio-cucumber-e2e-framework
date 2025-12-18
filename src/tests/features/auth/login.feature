Feature: User Login

    Scenario: Successful login with valid credentials
        Given the user has a registered account
        And is on the Login page
        When the user enters a valid email and password
        And clicks the Login button
        Then the user should be redirected to My Account page
