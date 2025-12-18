Feature: Search Product

    Scenario: Search for an exact product by name
        Given the user navigates to the Home page
        When the user enters Claw Hammer in the search bar
        And clicks the Search button
        Then the search results should display only Claw Hammer products
