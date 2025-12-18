    Feature: Add to cart
    
    Scenario: Add products to the cart
        Given the user is on a Product Details page
        When the user clicks Add to cart button
        Then the product should be added to the cart list
        And a successful message should appear


