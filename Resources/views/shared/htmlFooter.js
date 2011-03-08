view = '<script type="text/javascript">(function(){var a=document.getElementsByTagName("a");'
        + 'for(var i=0,l=a.length;i<l;i++){'
        + 'var h=a[i].attributes["href"];'
        + 'if(h)h.value="javascript:Ti.App.fireEvent(\'linkClicked\',{href:\'" + h.value + "\'});"'
        + '}})();</script></body></html>';