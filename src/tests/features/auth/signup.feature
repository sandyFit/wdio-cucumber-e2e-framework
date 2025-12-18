Feature: User Signup    
    
    Scenario: Successful Sign Up with valid data
        Given the user is on the Sign Up page
        When the user enters a valid info in all required inputs
        And clicks the Register button
        Then the system should create a new account
        And redirect to the Login page
