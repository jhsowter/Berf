using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Berf.MVC3.Startup))]
namespace Berf.MVC3
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
