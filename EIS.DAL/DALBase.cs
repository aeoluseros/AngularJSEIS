using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EIS.DAL
{
    public class DALBase
    {
        public EISDBContext db { get; set; }
        public DALBase()
        {
            db = new EISDBContext();
        }
    }
}
