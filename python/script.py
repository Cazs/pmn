#!/usr/bin/env python3

import sys
import requests
#i =0;
#def testMethod(arg):
    #return arg;
    #i=i+1;
    #print("Execution(%s) result of Python testMethod:  %s", i, arg);
#testMethod('value');

#s = input('enter str');
s = sys.argv[1];

def send_simple_message():
    return requests.post(
        "https://api.mailgun.net/v3/sandbox569c09e821d040c1aa3b10de25aa9242.mailgun.org/messages",
        auth=("api", "key-8bad9578f474ad6107ffa9e310b65dd9"),
        data={"from": "PMN<patricia@patrishnails.co.za>",
              "to": "Casper <201458657@student.uj.ac.za>",
              "subject": "Test 4",
              "text": "Can now send mail instantly. This was originaly sent at 16h05 SAST."});

send_simple_message();
print('done..');
